
USE Tree;

-- 1. 新增三种测评卷
INSERT INTO Assessment (name, description) VALUES
('MBTI人格类型测试', '基于MBTI理论的人格偏好测试，助你了解自我性格特质'),
('焦虑自评量表', '用于评估个体当前的焦虑水平（参考SAS量表）'),
('抑郁自评量表', '用于评估个体当前的抑郁风险（参考SDS量表）');

-- 假设插入后 id 分别为 1, 2, 3，如不确定可先 select 一下 Assessment 表。

-- 2. MBTI人格类型测试（assessmentId = 1）
INSERT INTO AssessmentQuestion (assessmentId, content, options) VALUES
(1, '你更喜欢的生活方式是？', '["A. 有计划地进行", "B. 随机应变", "C. 视情况而定", "D. 无所谓"]'),
(1, '在社交场合你会觉得？', '["A. 精力充沛", "B. 较为自在", "C. 略感压力", "D. 很疲惫"]'),
(1, '你做决定时更依赖？', '["A. 逻辑分析", "B. 情感感受", "C. 他人建议", "D. 随机选择"]'),
(1, '你更喜欢哪种工作环境？', '["A. 有规则有秩序", "B. 灵活自由", "C. 充满挑战", "D. 温馨安静"]'),
(1, '与人交往时你倾向于？', '["A. 主动发起对话", "B. 静静倾听", "C. 看情况", "D. 很少参与"]'),
(1, '遇到问题你更习惯？', '["A. 自己思考解决", "B. 向朋友倾诉", "C. 上网查资料", "D. 求助他人"]'),
(1, '你认为自己更像？', '["A. 理性主义者", "B. 感性主义者", "C. 两者兼有", "D. 不好说"]'),
(1, '当遇到新环境时你？', '["A. 积极适应", "B. 慢慢适应", "C. 略感不安", "D. 害怕改变"]'),
(1, '你喜欢的活动是？', '["A. 团体活动", "B. 小范围聚会", "C. 独自休息", "D. 没特别喜好"]'),
(1, '你的时间观念更偏向？', '["A. 守时准时", "B. 稍微拖延", "C. 视具体情况", "D. 随性无所谓"]');

-- 3. MBTI测试分数段评价（满分40分，演示分段）
INSERT INTO AssessmentRule (assessmentId, minScore, maxScore, level, report) VALUES
(1, 0, 15, '偏内向', '你的性格倾向于内向，更喜欢独处或小圈子活动，做事细致踏实。'),
(1, 16, 25, '均衡型', '你的性格较为均衡，能适应多种环境，外向与内向特质兼具。'),
(1, 26, 40, '偏外向', '你的性格倾向于外向，喜欢社交、乐于尝试新鲜事物，适应能力较强。');

-- 4. 焦虑自评量表（assessmentId = 2）
INSERT INTO AssessmentQuestion (assessmentId, content, options) VALUES
(2, '我感到手脚发抖', '["A. 从不", "B. 偶尔", "C. 经常", "D. 总是"]'),
(2, '我容易心慌或紧张', '["A. 从不", "B. 偶尔", "C. 经常", "D. 总是"]'),
(2, '我容易出汗', '["A. 从不", "B. 偶尔", "C. 经常", "D. 总是"]'),
(2, '我觉得头晕或头痛', '["A. 从不", "B. 偶尔", "C. 经常", "D. 总是"]'),
(2, '我难以入睡或早醒', '["A. 从不", "B. 偶尔", "C. 经常", "D. 总是"]'),
(2, '我容易感到疲劳或无力', '["A. 从不", "B. 偶尔", "C. 经常", "D. 总是"]'),
(2, '我经常担心自己的健康', '["A. 从不", "B. 偶尔", "C. 经常", "D. 总是"]'),
(2, '我对未来感到担忧', '["A. 从不", "B. 偶尔", "C. 经常", "D. 总是"]'),
(2, '我感到坐立不安', '["A. 从不", "B. 偶尔", "C. 经常", "D. 总是"]'),
(2, '我觉得很难专注或集中注意力', '["A. 从不", "B. 偶尔", "C. 经常", "D. 总是"]');

-- 5. 焦虑分数段与评价
INSERT INTO AssessmentRule (assessmentId, minScore, maxScore, level, report) VALUES
(2, 0, 13, '无焦虑', '你的焦虑水平处于正常范围，无需担心，保持积极的生活状态。'),
(2, 14, 20, '轻度焦虑', '你有轻度焦虑表现，建议适当休息、调整心态，关注情绪变化。'),
(2, 21, 30, '中度焦虑', '你的焦虑情绪较明显，建议多与他人交流、合理减压。'),
(2, 31, 40, '重度焦虑', '你的焦虑指数较高，请及时寻求专业心理帮助，关注身心健康。');

-- 6. 抑郁自评量表（assessmentId = 3）
INSERT INTO AssessmentQuestion (assessmentId, content, options) VALUES
(3, '我感到心情低落', '["A. 没有", "B. 偶尔", "C. 经常", "D. 总是"]'),
(3, '我对平时喜欢的活动失去兴趣', '["A. 没有", "B. 偶尔", "C. 经常", "D. 总是"]'),
(3, '我觉得自己没有价值', '["A. 没有", "B. 偶尔", "C. 经常", "D. 总是"]'),
(3, '我觉得精力不足，容易疲惫', '["A. 没有", "B. 偶尔", "C. 经常", "D. 总是"]'),
(3, '我感到难以入睡或早醒', '["A. 没有", "B. 偶尔", "C. 经常", "D. 总是"]'),
(3, '我觉得食欲减退', '["A. 没有", "B. 偶尔", "C. 经常", "D. 总是"]'),
(3, '我觉得做事提不起劲', '["A. 没有", "B. 偶尔", "C. 经常", "D. 总是"]'),
(3, '我感到内心空虚', '["A. 没有", "B. 偶尔", "C. 经常", "D. 总是"]'),
(3, '我难以集中注意力', '["A. 没有", "B. 偶尔", "C. 经常", "D. 总是"]'),
(3, '我有自杀或伤害自己的念头', '["A. 没有", "B. 偶尔", "C. 经常", "D. 总是"]');

-- 7. 抑郁分数段与评价
INSERT INTO AssessmentRule (assessmentId, minScore, maxScore, level, report) VALUES
(3, 0, 13, '无抑郁', '你的情绪状态良好，未见明显抑郁症状，请继续保持健康的生活习惯。'),
(3, 14, 20, '轻度抑郁', '你有轻度抑郁倾向，建议调整作息、适当锻炼，关注内心变化。'),
(3, 21, 30, '中度抑郁', '你的抑郁情绪较明显，建议主动寻求家人、朋友或心理咨询师帮助。'),
(3, 31, 40, '重度抑郁', '你的抑郁风险较高，请尽快联系专业心理医生，积极寻求支持和治疗。');
