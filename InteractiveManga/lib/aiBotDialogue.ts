export type ChoiceId = 'honest' | 'defensive';

export interface ChoiceOption {
  id: ChoiceId;
  label: string;
}

export type DialogueStep =
  | { kind: 'message'; text: string }
  | { kind: 'choice'; options: ChoiceOption[] };

export const PRE_CHOICE_STEPS: DialogueStep[] = [
  { kind: 'message', text: 'お前、この仕事やってて楽しいか？' },
  {
    kind: 'message',
    text: '最近の数字を見たぞ。仮説の切り口は悪くない。──が、熱がない。',
  },
  {
    kind: 'choice',
    options: [
      { id: 'honest', label: 'すみません、最近モチベが上がらなくて…' },
      { id: 'defensive', label: 'いえ、ちゃんとやっています。' },
    ],
  },
];

export const POST_CHOICE_STEPS: Record<ChoiceId, DialogueStep[]> = {
  honest: [
    {
      kind: 'message',
      text: '正直なのは良い。だが、それは原因じゃない。本音は？',
    },
    { kind: 'message', text: 'お前のやりたいことはなんだ？' },
    {
      kind: 'message',
      text: '…答えられないか。まあ、いい。次までに考えておけ。',
    },
  ],
  defensive: [
    {
      kind: 'message',
      text: '数字は嘘をつかない。「やってるつもり」は要らん。',
    },
    { kind: 'message', text: 'お前のやりたいことはなんだ？' },
    {
      kind: 'message',
      text: '…答えられないか。まあ、いい。次までに考えておけ。',
    },
  ],
};

export const buildDialogue = (choice: ChoiceId | null): DialogueStep[] =>
  choice ? [...PRE_CHOICE_STEPS, ...POST_CHOICE_STEPS[choice]] : PRE_CHOICE_STEPS;
