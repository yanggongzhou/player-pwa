export interface IWebAndLogParam {
  type: 'readplayletBegin' | 'readplayletEnd' | 'readplayletQuit';
  item_id: string;
  chapter_word_number: number;
  chapter_number: number;
  chapter_name: string;
  chapter_id: string;
  // buy_way: string;
  read_chapter_number?: number;
  reading_duration?: number;
}

export enum EIsPay {
  否 = 0,
  是 = 1,
}

export enum EAutoAdd {
  否 = 0,
  是 = 1,
}

export enum EIsSimplified {
  否 = 0,
  是 = 1,
}

export enum EBookFinishStatus {
  连载 = 1,
  完本 = 2,
  下架 = 3,
}
export enum EChapterStatus {
  免费 = 1,
  未付费 = 2,
  已付费 = 3,
}

export enum EIsCharge {
  免费 = 0,
  收费 = 1,
  vip免费 = 2,
  收费已购买 = 3
}

export enum EnumPline {
  小说大全 = '1',
  小说快读 = '2',
  小说阅读吧 = '3'
}
