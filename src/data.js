// Extracted from the government tables archived and audited in research/.
// These datasets describe different populations and must not be joined.
export const fees = Object.freeze([
  { label: '未付費', share: 12.9 },
  { label: '1–4,999', share: 27.3 },
  { label: '5,000–9,999', share: 37.5 },
  { label: '10,000–14,999', share: 14.4 },
  { label: '15,000–19,999', share: 5.0 },
  { label: '20,000–24,999', share: 1.8 },
  { label: '25,000–29,999', share: 0.8 },
  { label: '30,000 以上', share: 0.4 },
]);

export const households = Object.freeze([
  { group: 1, label: '第一所得組', people: 1.55, education: 1392 },
  { group: 2, label: '第二所得組', people: 2.08, education: 6227 },
  { group: 3, label: '第三所得組', people: 2.7, education: 15777 },
  { group: 4, label: '第四所得組', people: 3.35, education: 33450 },
  { group: 5, label: '第五所得組', people: 3.77, education: 55147 },
]);

export const scenarios = {
  care: {
    kicker: 'AFTER SCHOOL / 課後照顧',
    icon: '⌂',
    title: ['找到地方，', '還要接得上生活。'],
    description: '課後照顧能否用得上，需要一起看看家庭的費用、時間與孩子的需要。',
    conditions: [
      ['費用', '每月能負擔多少，還有哪些相關支出？'],
      ['時間', '開放到幾點，能不能接上家人的工作與接送？'],
      ['品質', '孩子需要哪種協助，服務是否適合？'],
    ],
    note: '名額、地點，以及能否由家人陪伴，也需要一起確認。',
  },
  learning: {
    kicker: 'LEARNING / 補習與才藝',
    icon: '✳',
    title: ['想學的事，', '有哪些能用的選擇？'],
    description: '從孩子的需要出發，看看課程、免費活動與在家學習各需要什麼條件。',
    conditions: [
      ['需要', '孩子想學什麼，需要哪種協助？'],
      ['費用', '報名與持續參與的費用，能否負擔？'],
      ['服務', '附近有哪些合適的課程或免費資源？'],
    ],
    note: '付費金額不能直接當成學習品質，也不能用來判定家長重視程度。',
  },
  transport: {
    kicker: 'ON THE WAY / 接送往返',
    icon: '↗',
    title: ['有合適的課，', '也要到得了。'],
    description: '往返需要的時間、費用與接送人力，都是安排學習時需要了解的條件。',
    conditions: [
      ['路程', '距離多遠，有哪些可以使用的交通方式？'],
      ['費用', '除了課程，交通還會增加哪些支出？'],
      ['時間', '誰能在需要的時段接送，是否能銜接？'],
    ],
    note: '即使課程費用能負擔，也還需要了解往返的實際條件。',
  },
  family: {
    kicker: 'TIME TOGETHER / 家人陪伴',
    icon: '◷',
    title: ['有些付出，', '用時間來計算。'],
    description: '家人陪伴可能沒有一張收費單，仍需要配合工作與其他照顧安排。',
    conditions: [
      ['人力', '家中有誰能提供陪伴或學習協助？'],
      ['時間', '能陪多久，是否與工作或其他照顧重疊？'],
      ['需要', '孩子需要的協助，家人能如何回應？'],
    ],
    note: '這些條件沒有都出現在費用統計中，需要進一步了解。',
  },
};

export const questions = {
  cost: '要理解負擔，需要看同一個家庭的收支、在學孩子數量與實際需求；組別平均還不能替一個家庭回答。',
  service:
    '費用表沒有呈現服務的開放時間、品質與是否符合孩子需要。這些是理解選擇時，還要進一步了解的條件。',
  gap: '要回答差距是否擴大，需要相同對象、指標與定義的跨年資料；這裡的 2022 與 2025 年資料不能直接當成趨勢。',
};
