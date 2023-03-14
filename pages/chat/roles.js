const roles = [{
  id: 'default',
  name: '小P',
}, {
  id: 'work-log',
  name: '周报生成器',
  prompt: ''
}, {
  id: 'translator',
  name: '小翻译',
  prompt: 'I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations',
  greeting: 'I will be your English translator',
}]

export default roles;