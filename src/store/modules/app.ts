import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import { IAppState } from '@/store/modules/index.model'
import { IBookInfo, IChapterInfo, INetVideoSourceRes } from '@/types/player.interface'
import { netRecommendBook, netVideoPre, netVideoSource } from '@/api/player'
import { EAutoAdd, EBookFinishStatus, EChapterStatus, EIsCharge, EIsSimplified } from '@/types/common.interface'
import { ChaptersModule } from '@/store/modules/chapters'
import { useI18n } from 'vue-i18n'
import { DeviceModule } from '@/store/modules/device'

@Module({
  dynamic: true,
  store,
  name: 'app'
})
class App extends VuexModule implements IAppState {
  public bookInfo = {} as IBookInfo;
  public swipeList = [] as IChapterInfo[];
  public swipeIndex = 0;
  public isShowEndPage = false;
  public recommendData = {} as INetVideoSourceRes;
  @Mutation
  private SET_RECOMMENDDATA (data: INetVideoSourceRes) {
    this.recommendData = data
  }

  @Mutation
  private SET_ISSHOWENDPAGE (is: boolean) {
    this.isShowEndPage = is
  }

  @Mutation
  private SET_BOOKINFO (info: IBookInfo) {
    this.bookInfo = Object.assign({}, info)
  }

  @Mutation
  private SET_SWIPELIST (list: IChapterInfo[]) {
    if (ChaptersModule.chapterAllList.length > 0) {
      this.swipeList = list.map(val => {
        const chapterItem = ChaptersModule.chapterAllList.find(catalog => catalog.chapterId === val.chapterId)
        return { ...val, chapterIndex: chapterItem ? chapterItem.chapterIndex : val.chapterIndex }
      })
    } else {
      this.swipeList = JSON.parse(JSON.stringify(list))
    }
  }

  @Mutation
  private ADD_SWIPELIST (info: IChapterInfo) {
    const isExistInfo = this.swipeList.find(val => val.chapterId === info.chapterId) // 是否存在
    const _info = JSON.parse(JSON.stringify(info))
    if (ChaptersModule.chapterAllList.length > 0) {
      const chapterItem = ChaptersModule.chapterAllList.find(catalog => catalog.chapterId === info.chapterId)
      if (chapterItem) _info.chapterIndex = chapterItem.chapterIndex;
    }
    if (!isExistInfo) {
      this.swipeList = this.swipeList.concat(_info)
    }
    // 当存在且是未付费，替换付费数据
    if (isExistInfo && isExistInfo.chapterStatus === EChapterStatus.未付费) {
      this.swipeList = this.swipeList.map(val => {
        if (val.chapterId === _info.chapterId) {
          return _info
        }
        return val
      })
    }

  }

  @Mutation
  private SET_SWIPEINDEX (index: number) {
    this.swipeIndex = index
  }

  @Action({ rawError: true })
  public async SetSwipeIndex (index: number) {
    this.SET_SWIPEINDEX(index)
    console.log('SetSwipeIndex-------------->', index)
    // 切换swipe时判断是否还展示追剧按钮
    if (ChaptersModule.isShowDrama && this.bookInfo.autoAdd === EAutoAdd.是) {
      ChaptersModule.SetIsShowDrama(false)
    }
    if (this.isShowEndPage) {
      this.SetIsShowEndPage(false)
    }
    if (ChaptersModule.chapterAllList.length === 0) return
    const chapterInfo = ChaptersModule.chapterAllList[this.swipeList[index].chapterIndex - 1]
    const nextChapter = ChaptersModule.chapterAllList[chapterInfo.chapterIndex]
    // 判断下一集是否付费，付费塞付费部分数据
    if (nextChapter.isCharge === EIsCharge.收费) {
      this.AddSwipeList({
        chapterId: nextChapter.chapterId,
        chapterStatus: EChapterStatus.未付费,
        chapterIndex: nextChapter.chapterIndex,
        chapterName: nextChapter.chapterName
      })
    } else {
      const data = await netVideoPre(this.bookInfo.bookId, nextChapter.chapterId)
      if (!data) return;
      this.AddSwipeList(data.chapterInfo)
    }
  }

  @Action({ rawError: true }) // 添加swipe数据
  public AddSwipeList (info: IChapterInfo) {
    this.ADD_SWIPELIST(info)
  }

  @Action({ rawError: true }) // 是否展示最终页
  public SetIsShowEndPage (is: boolean) {
    this.SET_ISSHOWENDPAGE(is)
  }

  @Action({ rawError: true }) // 设置书籍信息
  public SetBookInfo (info: IBookInfo) {
    this.SET_BOOKINFO(info)
  }

  @Action({ rawError: true })
  public async InitVideoSource (bookId?: string) { // 初始化书籍
    const data = await netVideoSource(bookId, '')
    if (!data) return;
    if (data.isSimplified !== undefined) {
      const { locale } = useI18n()
      locale.value = data.isSimplified === EIsSimplified.是 ? 'zh-cn' : 'zh-hk'
    }
    if (data.isFirstPlay) {
      DeviceModule.SetIsShowOperationTip(true);
    }
    if (!data.bookInfo) return;
    if (data.bookInfo.bookFinishStatus === EBookFinishStatus.下架) {
      this.SetIsShowEndPage(true)
      this.SetBookInfo(data.bookInfo)
      return
    }
    // 必须先获取章节列表再覆盖swipe数据
    await ChaptersModule.GetAllChapterList(data.bookInfo.bookId)
    this.RefreshVideoSource(data)
    // 获取推荐章节
    data.bookInfo.bookId && await this.RecommendVideoSource(data.bookInfo.bookId)
  }

  @Action({ rawError: true }) // 获取推荐书籍
  public async RecommendVideoSource (bookId: string) {
    const data = await netRecommendBook(bookId)
    console.log('-----------S 推荐书籍 data-----------', data)
    this.SET_RECOMMENDDATA(data || {})
  }

  @Action({ rawError: true }) // 倒计时结束更新书籍
  public RefreshVideoSource ({ bookInfo = {} as IBookInfo, chapterInfo = {} as IChapterInfo }: INetVideoSourceRes) {
    ChaptersModule.SetIsShowDrama(bookInfo.autoAdd === EAutoAdd.否)
    this.SetIsShowEndPage(false)
    this.SetBookInfo(bookInfo)
    this.SET_SWIPELIST([chapterInfo])
    this.SetSwipeIndex(0)
  }

  @Action({ rawError: true }) // 选择章节更新书籍
  public RefreshSelectSource (chapterInfo: IChapterInfo) {
    ChaptersModule.SetIsShowDrama(this.bookInfo.autoAdd === EAutoAdd.否)
    this.SetIsShowEndPage(false)
    this.SET_SWIPELIST([chapterInfo])
    this.SetSwipeIndex(0)
    if (ChaptersModule.chapterAllList.length === 0) return
    const index = ChaptersModule.chapterAllList.findIndex(val => val.chapterId === chapterInfo.chapterId)
    const chapterIndex = index !== -1 ? ChaptersModule.chapterAllList[index].chapterIndex : chapterInfo.chapterIndex
    if (chapterIndex === ChaptersModule.totalChapters) return
    const nextChapter = ChaptersModule.chapterAllList[chapterIndex]
    // 判断下一集是否付费，付费塞付费部分数据
    if (nextChapter.isCharge === EIsCharge.收费) {
      // netVideoPre(this.bookInfo.bookId, nextChapter.chapterId)
    }
  }

  @Action({ rawError: true }) // 支付完成后刷新数据
  public async RefreshPaySource (chapterInfo: IChapterInfo) {
    this.SET_SWIPELIST([chapterInfo])
    this.SET_SWIPEINDEX(0)
    if (ChaptersModule.chapterAllList.length === 0 || chapterInfo.chapterIndex === ChaptersModule.totalChapters) return
    const nextChapter = ChaptersModule.chapterAllList[chapterInfo.chapterIndex]
    // 判断下一集是否付费，付费塞付费部分数据 && 是否开启自动付费了
    if (nextChapter.isCharge === EIsCharge.收费) {
      this.AddSwipeList({
        chapterId: nextChapter.chapterId,
        chapterStatus: EChapterStatus.未付费,
        chapterIndex: nextChapter.chapterIndex,
        chapterName: nextChapter.chapterName
      })
    }
    const data = await netVideoPre(this.bookInfo.bookId, nextChapter.chapterId)
    if (!data) return;
    this.AddSwipeList(data.chapterInfo)
  }
}

export const AppModule = getModule(App)
