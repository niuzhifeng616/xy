//天璇星 课程
<template>
  <div class="page-merak">
      <div class="main">
        <h3>
          <span>{{evaData.活动名称}}</span>
        </h3>
        <div class="color-span">
          <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>

          <div class="evalute">
          <div class="evaMain" v-show="evaData.活动名称 === '晨诵'">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>1.习诵中领略母语之美。</p>
                <p>2.吟诵中学习儒雅之风。</p>
                <p>3.成诵后夯实人文之蕴。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、时间安排</p>
                <p style="text-indent:2em;">朝朝晨诵（小学 8:20-8:45,初中 7:30-7:55）</p>
                <p style="color:#59BEB7;">二、内容安排</p>
                <p style="text-indent:2em;">部编版语文教材及推荐篇目，内容主要是古典诗词、现代诗歌以及文言文。</p>
                <p style="color:#59BEB7;">三、实施方案</p>
                <p style="text-indent:2em;">（一）学校层面</p>
                <p style="text-indent:2em;">1.统筹安排好每日晨诵的25分钟，形成全校统一的课程时间。</p>
                <p style="text-indent:2em;">2.把每年的四月份定为“读书月”，开展系列读书活动，在4月23日举办“读书节”。“读书节”要强化仪式，有固定、庄重、简洁的开幕仪式，有文化品位和学校特色，还要有系列经典诵读竞赛活动，诗歌朗诵会、演讲比赛、古诗吟诵擂台赛等，通过“背、唱、演、说、画”等形式，让学生从诗词里感悟中华文化的精髓，并留下难忘的印象。</p>
                <p style="text-indent:2em;">3.设立多层面的展示平台。学校在广播站开辟经典诗文诵读栏目，或请学生当场展示朗诵，或播放“与经典为友，与圣贤为伍”的故事系列，让学生领略古往今来博大精深的文化精髓，在欣赏中得到情感陶冶。还可以利用公众号平台的形式，开设诵读专栏，给予学生更多展示空间。</p>
                <p style="text-indent:2em;">4.鼓励各班发展特色的吟诵形式，如读、背、吟、唱、画、说、写、改编等。</p>
                <p style="text-indent:2em;">（二）班级层面</p>
                <p style="text-indent:2em;">1.在每学期的开始，做好班级特色诵读计划，细化日常吟诵练习和展示。</p>
                <p style="text-indent:2em;">2.班级可以根据自己的实际，每学期利用主题班会开展一次诵读活动。</p>
                <p style="text-indent:2em;">3.积极参与学校的诗文诵读活动，做好班级的展示与表彰工作。</p>
                <p style="text-indent:2em;">4.成立班级“诵读社团”。</p>
                <p style="text-indent:2em;">（三）教师层面</p>
                <p style="text-indent:2em;">晨诵时，教师与学生一起朗诵，一起陶醉，一起激励，教师、学生、诗歌交织在一起。通过《晨诵》课程，师生都能得到灵感的激发，并走入诗中，感动于花开花落，平淡于云卷云舒。像沈从文那般“于清晨极静之时，听着鸟鸣，灵感的花朵自由绽放。”  </p>
                <p style="text-indent:2em;">＊晨诵基本流程：</p>
                <p style="text-indent:2em;">1.教师范读，引入诗境。2.师生共读，同悟诗境。</p>
                <p style="text-indent:2em;">3.个性悟读，领略诗境。4.展示美读，陶醉诗境。</p>
                <p style="text-indent:2em;">（四）学生层面</p>
                <p style="text-indent:2em;">倡导自主、民主的个性化诵读，不搞一刀切。学生随时可以根据自己的实际，选择申请不同的诵读等级，也可以创造个性化的诵读方式。</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.积极开展诵读课程
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  2.在期末测评中表现优异
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  3.在一年一度的学校活动中表现突出，获得奖项
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p style="border:0;">
                  4.参与校内外相关活动
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">资料上传</div>
              <div class="evaRight">上传照片、文件、证书（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight" v-if="evaData.length !== 0">{{evaData.等级评价}}</div>
            </div>
          </div>
          <div class="evaMain" v-show="evaData.活动名称 === '“英语口语”大赛'">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>为了给学生营造一个良好的英语学习氛围，提高学生的英语口语交际能力，调动学生学习英语的积极性，提供学生展现自我的舞台，我校英语组组织学生参加英语口语竞赛活动，让学生在学习英语的同时体验学习的成功与快乐，让学生对英语更感兴趣，更好地学英语。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、活动时间</p>
                <p style="text-indent:2em;">9月6日-10月13日</p>
                <p style="color:#59BEB7;">二、活动内容</p>
                <p style="text-indent:2em;">1.筹备：各班英语老师要充分调动学生参与的积极性，引起学生对本次活动的重视，踊跃参加这次活动，认真准备，使这次活动圆满成功。</p>
                <p style="text-indent:2em;">2.初赛——班级自选：学生自我介绍，时间限定在3分钟以内， 9月15日前由各英语任课教师在任教班级进行，每班推荐2人参加复赛（具体情况根据各班级实际情况而定）。</p>
                <p style="text-indent:2em;">3.复赛——分年级进行：学生自我介绍和现场问答，时间限定在3分钟以内，9月17日之前各年级推荐4人进入决赛（具体情况根据各年级实际情况而定）。</p>
                <p style="text-indent:2em;">4.决赛——学校组织决赛：进行主题为“红色东莞·百年奋进”的演讲和单词拼读、连词成句、现场问答，时间在10月13日进行，抽签决定比赛顺序。</p>
                <p style="color:#59BEB7;">三、考核要求</p>
                <p style="text-indent:2em;">1.踊跃参与本次活动。</p>
                <p style="text-indent:2em;">2.过程准备充分，按照主题，搜索相关资源，撰写演讲稿。</p>
                <p style="text-indent:2em;">3.英语表达准确流利，语速恰当。</p>
                <p style="text-indent:2em;">4.表达内容语句通顺，紧扣主题。</p>
                <p style="text-indent:2em;">5.肢体语言自然得体，仪表仪态大方。</p>
                <p style="text-indent:2em;">6.能够根据情境正确地使用英语回应。</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.积极参与
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  2.准备充分
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  3.流利表达
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">上传照片（8张）、综合成绩（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight" v-if="evaData.length !== 0">{{evaData.等级评价}}</div>
            </div>
          </div>
          <div class="evaMain" v-show="evaData.活动名称 === '文艺汇演'">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>以“艺术节”音乐活动为契机，举办声乐+器乐+舞蹈+语言艺术的才艺大赛。培养学生集体荣誉感与凝聚力，增强学生自信心。在比赛中提升学生舞台表演能力和对音乐的审美能力。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、活动时间</p>
                <p style="text-indent:2em;">12月1日-12月31日</p>
                <p style="color:#59BEB7;">二、活动内容</p>
                <p style="text-indent:2em;">全体学生，以班级为单位上交才艺视频，每班不限制作品数量，不限制人数，可跨班级、跨年级组合。</p>
                <p style="color:#59BEB7;">三、考核管理</p>
                <p style="text-indent:2em;">1.内容要求</p>
                <p style="text-indent:2em;">声乐、器乐、舞蹈、语言艺术等。个人、小组、群体节目均可参加，可跨班、跨年级组合。除钢琴外，其它所需乐器自备。通过选拔的节目可参加年级文艺汇演。</p>
                <p style="text-indent:2em;">2.视频格式和技术要求</p>
                <p style="text-indent:2em;">（1）视频时间应控制5分钟内，不宜过长。</p>
                <p style="text-indent:2em;">（2）统一上交视频格式为MP4，横屏拍摄，画质流畅清晰，无闪烁、卡顿，无黑边现象。期末成绩=过程性评价成绩50%+终结性评价成绩50%</p>
                <p style="text-indent:2em;"></p>
                <p style="text-indent:2em;">注：过程性评价成绩（满分50分）=个人分数/班级最高分X50</p>
                <p style="text-indent:2em;">终结性成绩（满分50分  根据班级预赛情况赋予分数）</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.积极参与
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  2.认真排练
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  3.自信表演
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">上传照片（8张）、综合成绩（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight" v-if="evaData.length !== 0">{{evaData.等级评价}}</div>
            </div>
          </div>
          <div class="evaMain" v-show="evaData.活动名称 === '“计算魔法师”大赛'">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>为了丰富我校校园文化生活,进一步激发学生学习数学的兴趣,引导学生对数学基础知识学习的重视以及培养学生良好的计算习惯、提高计算能力,促进学生数感的全面提升。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、活动时间</p>
                <p style="text-indent:2em;">12月31日</p>
                <p style="color:#59BEB7;">二、活动内容</p>
                <p style="text-indent:2em;">全体学生，以班级为单位进行计算竞赛，以正确率和时长为主要依据，正确   率优先考虑，正确率相同的前提下，用时越短的同学获胜，每个班级评选出前六名学生(其中一等奖1名，二等奖2名，三等奖3名).</p>
                <p style="color:#59BEB7;">三、考核管理</p>
                <p style="text-indent:2em;">1.内容要求</p>
                <p style="text-indent:2em;">考核内容贴合学生学情,难度要求有层次,以本期教材为依据，适当覆盖本学期所有的计算内容。</p>
                <p style="text-indent:2em;">2.成绩组成</p>
                <p style="text-indent:2em;">期末成绩=过程性评价成绩50%+终结性评价成绩50%</p>
                <p style="text-indent:2em;"></p>
                <p style="text-indent:2em;">注：过程性评价成绩（满分50分）=个人分数/班级最高分X50</p>
                <p style="text-indent:2em;">终结性成绩（满分50分  根据班级竞赛情况赋予分数）</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.积极参与
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  2.完成度高
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  3.用时短
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">上传照片（8张）、综合成绩（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight" v-if="evaData.length !== 0">{{evaData.等级评价}}</div>
            </div>
          </div>
          <div class="evaMain" v-show="evaData.活动名称 === '美术展'">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>为了丰富校园文化生活，培养学生健康的审美情趣和良好的艺术修养，提高感受美、表现美、鉴赏美和创造美的能力，激发创新意识和创造能力，促进学生的全面发展和校园文化建设，提升学校的办学品位，通过组织活动，激发学生热爱艺术，勇于创新的勇气，全面展示学校美术兴趣活动，特长培养等教育成果和我校师生积极向上的精神风貌，活跃校园文化，营造积极向上、和谐文明的校园文化艺术氛围。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、时间安排</p>
                <p style="text-indent:2em;">第一阶段前期准备（10月底-11月底）</p>
                <p style="text-indent:2em;">宣传发动，面向全校征稿（每个班10张作品左右）</p>
                <p style="text-indent:2em;">第二阶段具体实施</p>
                <p style="text-indent:2em;">A、11月下旬筛选并确定参展作品（150张左右）</p>
                <p style="text-indent:2em;">B、参展作品统一由学校装裱</p>
                <p style="text-indent:2em;">第三阶段画展开幕（12月中旬）</p>
                <p style="text-indent:2em;">宣传策划，布置展览。</p>
                <p style="color:#59BEB7;">二、参展要求</p>
                <p style="text-indent:2em;">（1）绘画作品</p>
                <p style="text-indent:2em;">国画、水彩、版画，或其他画种：尺寸均不超过对开。卡通画：单幅尺寸为2开；或短篇4格，每格尺寸为16开。</p>
                <p style="text-indent:2em;">（2）书法作品</p>
                <p style="text-indent:2em;">书法字体不限，尺寸均不超过四尺宣纸。</p>
                <p style="text-indent:2em;">（3）摄影作品</p>
                <p style="text-indent:2em;">单张照和组照（每组不超过4幅，需标明顺序号），尺寸均为10寸。</p>
                <p style="color:#59BEB7;">三、展厅具体布置</p>
                <p style="text-indent:2em;">1、展厅布置</p>
                <p style="text-indent:2em;">展出地点为学校中庭广场、图书馆阅读区</p>
                <p style="text-indent:2em;">将采用展板，装裱的形式举行画展，以便参观者能更加舒适的参观完整个展览。</p>
                <p style="text-indent:2em;">2、人员分配</p>
                <p style="text-indent:2em;">为了保证展厅的整洁、秩序、和安全，将轮流值班。（每次两人，由美术组成员担任）</p>
                <p style="color:#59BEB7;">四、预期效果</p>
                <p style="text-indent:2em;">希望通过这次健康向上、丰富多彩的学生书画摄影展活动，让全体师生全程参与，使其掌握创作方法，了解布展程序，尽享绘画快乐，体验艺术之魅力，提高审美品质，使其潜移默化终生受益。另外全面活跃校园文化生活和气氛，引导学生创作和欣赏艺术作品的兴趣，发现和培养学生艺术人才、提供学生健康有益的作品，充分展示我校艺术教育的成果，促进校园精神文明建设，引导学生健康成长。</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.积极投稿
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  2.画面精美
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  3.主题积极
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">上传照片（8张）、综合成绩（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight" v-if="evaData.length !== 0">{{evaData.等级评价}}</div>
            </div>
          </div>
          <div class="evaMain" v-show="evaData.活动名称 === '午练'">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>1.掌握汉字的基本笔画和常用的偏旁部首，能按笔顺规则用硬笔写字，注意间架结构。初步感受汉字的形体美。</p>
                <p>2.养成正确的写字姿势和良好的写字习惯，书写规范、端正、整洁。</p>
                <p>3.能正确工整地书写汉字，并有一定的速度。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一.午练时间：</p>
                <p style="text-indent:2em;">14：20-14：35</p>
                <p style="color:#59BEB7;">二、午练内容：</p>
                <p style="text-indent:2em;">各班根据午练课程教学视频或教师示范进行午练，一练坐姿，二练握笔，三练静气，四练速度。确保午练课程按既定流程组织实施；确保学生坐姿端正、执笔规范与静心习字。</p>
                <p style="color:#59BEB7;">三、考核管理：</p>
                <p style="text-indent:2em;">学期末学生个人评价由过程性评价与终结性评价组成，各占50%，过程性评价由每日午练评价自动生成，终结性评价由上传的书写作品进行评价，按本班整体写字水平划分优（85分以上）、良（70-84）、合格（60-69）、不合格（60以下）四个等次。期末成绩=过程性评价成绩50%+终结性评价成绩50%</p>
                <p style="text-indent:2em;margin-top:40px;">注：过程性评价成绩（满分50分 由平台自动计算）=个人分数/班级最高分X50</p>
                <p style="text-indent:2em;">终结性成绩（满分50分  教师根据午练作品赋予分数）</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.双姿正确
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  2.安静书写
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                <p style="border:0;">
                  3.按时完成
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">资料上传</div>
              <div class="evaRight">上传照片、文件、证书（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight" v-if="evaData.length !== 0">{{evaData.等级评价}}</div>
            </div>
          </div>
          <div class="evaMain" v-show="evaData.活动名称.indexOf('品质北区') !== -1">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>为了营造“书香北区”的环境氛围，引发学生对阅读的兴趣，倡导爱读书、勤读书、乐读书，培养学生节俭、有好书一起分享以及良好的读书习惯，举行“图书漂流”活动。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、活动时间</p>
                <p style="text-indent:2em;">4月30日下午</p>
                <p style="color:#59BEB7;">二、活动内容</p>
                <p style="text-indent:2em;">（1）每个学生准备5本漂流图书，一本留班级固定摊位，四本自己随意走动交换。</p>
                <p style="text-indent:2em;">（2）去摊位换书或跟同学交换书，完成后与伙伴合影，并阅读分享。</p>
                <p style="color:#59BEB7;">三、考核管理</p>
                <p style="text-indent:2em;">学期末学生个人评价由过程性评价与终结性评价组成，各占50%，过程性评价由学科组长根据平时考核进行打分评价，终结性评价由各班级预赛时考核小组统一考核，按本班整体写字水平划分优（x＜40%）、良（40%≤x＜80%）、合格（80%≤x＜100%）、不合格（未能掌握基本方法）四个等次。</p>
                <p style="text-indent:2em;">期末成绩=过程性评价成绩50%+终结性评价成绩50%</p>
                <p style="color:#59BEB7;">注：过程性评价成绩（满分50分）=个人分数/班级最高分X50</p>
                <p style="text-indent:2em;">终结性成绩（满分50分  根据班级预赛情况赋予分数）</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.积极参与活动
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  2.能有礼貌与人交换书籍
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p style="border: 0;">
                  3.愿意与人分享自己看的书
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">资料上传</div>
              <div class="evaRight">上传照片（8张）、综合成绩（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight" v-if="evaData.length !== 0">{{evaData.等级评价}}</div>
            </div>
          </div>
          <div class="evaMain" v-show="evaData.活动名称.indexOf('以书为舟') !== -1">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>本课程旨在通过创设一个真实的通信情境，让学生学会给同辈写信，不仅要格式正确，还要叙事清楚，并能与他人进行思想交换与情绪沟通。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、活动时间</p>
                <p style="text-indent:2em;">2021年3月5日-2021年7月1日</p>
                <p style="color:#59BEB7;">二、活动内容</p>
                <p style="text-indent:2em;">（1）第一阶段（2021年3月4日-2021年3月7日）</p>
                <p style="text-indent:2em;">a.拟定方案；</p>
                <p style="text-indent:2em;">b.开展宣传倡议活动；</p>
                <p style="text-indent:2em;">c.两校沟通确定活动具体内容；</p>
                <p style="text-indent:2em;">c.两校沟通确定活动具体内容；</p>
                <p style="text-indent:2em;">d.录制书信写作指导微课。</p>
                <p style="text-indent:2em;">（2）第二阶段（2021年3月7日-3月14日）</p>
                <p style="text-indent:2em;">a.利用微课开展书信写作指导。</p>
                <p style="text-indent:2em;">b.松山湖北区学校七年级学生每人准备一本书，并写一封信给墨江中学学生。</p>
                <p style="text-indent:2em;">c.指导修改各班学生所写的书信。</p>
                <p style="text-indent:2em;">d.松山湖北区学校准备信封和信纸。</p>
                <p style="text-indent:2em;">（3）第三阶段（2021年1月9日-22日）</p>
                <p style="text-indent:2em;">a.寄信。（学生按年级、班级、学号对应墨江中学各级学生。）</p>
                <p style="text-indent:2em;">b.送书。（每一本书扉页上盖东莞市松山湖北区学校公章，留白处给学生写上赠语。）</p>
                <p style="text-indent:2em;">c.墨江中学学生回信。</p>
                <p style="text-indent:2em;">d.开展活动总结。</p>
                <p style="color:#59BEB7;">三、考核管理</p>
                <p style="text-indent:2em;">学期末学生个人评价由过程性评价与终结性评价组成，各占50%，过程性评价由学科组长根据平时考核进行打分评价，终结性评价由各班级预赛时考核小组统一考核，按本班整体写字水平划分优（x＜40%）、良（40%≤x＜80%）、合格（80%≤x＜100%）、不合格（未能掌握基本方法）四个等次。</p>
                <p style="text-indent:2em;">期末成绩=过程性评价成绩50%+终结性评价成绩50%</p>
                <p style="color:#59BEB7;">注：过程性评价成绩（满分50分）=个人分数/班级最高分X50</p>
                <p style="text-indent:2em;">终结性成绩（满分50分  根据班级预赛情况赋予分数）</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.积极参与
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p style="border: 0;">
                  2.态度端正
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">资料上传</div>
              <div class="evaRight">上传照片（8张）、综合成绩（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight" v-if="evaData.length !== 0">{{evaData.等级评价}}</div>
            </div>
          </div>
          <div class="evaMain" v-show="evaData.活动名称 === '当扑克遇上数学'">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight" v-show="grade === 201">
                <p>1.提高小学生运算能力；</p>
                <p>2.转变学生的学习方式；</p>
                <p>3.提高学生数学学习能力；</p>
                <p>4.激发学生的学习兴趣。</p>
              </div>
              <div class="evaRight" v-show="grade === 202">
                <p>1.“用扑克牌玩乘法口诀”数学活动提高小学生运算能力；</p>
                <p>2.“用扑克牌玩乘法口诀”数学活动转变学生的学习方式；</p>
                <p>3.“用扑克牌玩乘法口诀”数学活动提高学生数学学习能力 ；</p>
                <p>4.“用扑克牌玩乘法口诀”数学活动激发学生的学习兴趣。</p>
              </div>
              <div class="evaRight" v-show="grade === 203">
                <p>1.算“24点”数学活动提高小学生运算能力；</p>
                <p>2.算“24点”数学活动转变学生的学习方式；</p>
                <p>3.算“24点”数学活动提高学生数学学习能力；</p>
                <p>4.算“24点”数学活动激发学生的学习兴趣。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、活动时间</p>
                <p style="text-indent:2em;">4月16日</p>
                <p style="color:#59BEB7;">二、活动内容</p>
                <p style="text-indent:2em;" v-show="grade === 201">用扑克牌做加法口算。（分为初赛与决赛）</p>
                <p style="text-indent:2em;" v-show="grade === 202">两人一组进行比赛，开局时每人20张扑克牌（不含J、Q、K和鬼牌），两人同时翻开一张，并迅速说出两张牌的数字之和，答案正确且速度快者可以拿走桌面上的两张牌。游戏限时3分钟，游戏结束时，手里扑克牌数量多者获胜。</p>
                <p style="text-indent:2em;" v-show="grade === 203">两人一组进行比赛，开局时每人20张扑克牌（不含J、Q、K和鬼牌），每人翻开一张，并迅速说出两张牌的数字相乘的得数，答案正确且速度快者可以拿走桌面上的两张牌。游戏限时3分钟，游戏结束时，手里扑克牌数量多者获胜。数学是思维的体操，一个人思维的发展，离不开数学的学习。为了营造浓厚的数学学习氛围，促进学生学习兴趣，本次数学节以“当扑克牌遇上数学”为主题，开展一系列数学活动，为学生搭建展示数学智慧的平台，启迪学生的数学思维。通过数学节活动，让学生真正走进数学、感受数学、喜欢数学，从而提升数学学科素养，获得积极的数学学习情感体验。</p>
                <p style="text-indent:2em;" v-show="grade === 207">算“24点”，又称“24点”游戏，通常用扑克牌来玩，即从一副扑克牌中去掉大小王(52张牌)后(如果是初入门，可以选用1～10这40张牌)，任意抽取4张，每张牌必须用并且只能用一次，用加、减、乘、除(可运用括号)把牌面上的点数算成是24，其中A、J、Q、K分别表示1、11、12、13。根据心理学的理论，小学生的认知规律是“感知、动作——表象——概念、符号”，以“24点”游戏为计算能力提升载体，学生在感知大量事例的过程中能建立牢固而清晰的表象，逐步认识到运算规律的存在。并且让学生在具有浓厚兴趣的游戏氛围中遭遇运算问题，进而运用运算知识解决问题，能理解和升华对运算知识的认识，培养学生的运算能力和抽象思维。</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.积极参与
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p :style="{borderBottom: grade !== 201 ? 0 : '1px solid #59BEB7'}">
                  2.思维敏捷
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p v-show="grade === 201" style="border: 0;">
                  3.遵守规则
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">资料上传</div>
              <div class="evaRight">上传照片（8张）、综合成绩（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight" v-if="evaData.length !== 0">{{evaData.等级评价}}</div>
            </div>
          </div>
          <div class="evaMain" v-show="evaData.活动名称 === '党史知识竞赛'">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>百年华诞，历久弥新，峥嵘岁月，继往开来。为深入学习、贯彻、落实习近平总书记关于学习党史的重要讲话和指示精神，进一步坚定理想信念，传承红色基因，激发爱国爱党氛围，秉持以赛促学，以学促做，以做践行的原则，松山湖北区学校历史科组结合上级相关部门通知要求，在“学”、“思”、“践”、“悟”的基础上举办党史党建知识活动竞赛。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、活动时间</p>
                <p style="text-indent:2em;">3月28日、4月7日、待定</p>
                <p style="color:#59BEB7;">二、活动内容</p>
                <p style="text-indent:2em;">（1）校内预赛：智慧平板问答</p>
                <p style="text-indent:2em;">（2）校内决赛：必答题、展示题、风险题、嫁祸题（四轮结束后，若有队伍分数相同，采用附加题）</p>
                <p style="text-indent:2em;">（3）松山湖园区预赛：5月8日</p>
                <p style="text-indent:2em;">（4）松山湖片区复赛、东莞市决赛：待定</p>
                <p style="color:#59BEB7;">三、考核管理</p>
                <p style="text-indent:2em;">学期末学生个人评价由过程性评价与终结性评价组成，各占50%，过程性评价由学科组长根据平时考核进行打分评价，终结性评价由各班级预赛时考核小组统一考核，按本班整体写字水平划分优（x＜40%）、良（40%≤x＜80%）、合格（80%≤x＜100%）、不合格（未能掌握基本方法）四个等次。</p>
                <p style="text-indent:2em;">期末成绩=过程性评价成绩50%+终结性评价成绩50%</p>
                <p style="color:#59BEB7;">注：过程性评价成绩（满分50分）=个人分数/班级最高分X50</p>
                <p style="text-indent:2em;">终结性成绩（满分50分  根据班级预赛情况赋予分数）</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.积极参与。
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  2.能够说出党建立的相关史实和重大意义。
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p style="border:0;">
                  3.能够说出党史上的重要人物和重大事件。
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">资料上传</div>
              <div class="evaRight">上传照片（8张）、综合成绩（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight" v-if="evaData.length !== 0">{{evaData.等级评价}}</div>
            </div>
          </div>
          <div class="evaMain" v-show="evaData.活动名称 === '“行知地理”创意绘图活动'">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>本课程旨在全员参与的过程中，培养学生的想象力，思维力和地理实践力，让学生在活动中提升想象力及动手能力，提升地理学科核心素养。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、活动时间</p>
                <p style="text-indent:2em;">3月18日</p>
                <p style="color:#59BEB7;">二、活动内容</p>
                <p style="text-indent:2em;">提供东莞及北区学校空白轮廓图，学生根据对东莞及北区学校的理解进行创意绘画，最后评选出最佳美工奖、最佳创意奖奖项。</p>
                <p style="color:#59BEB7;">三、考核管理</p>
                <p style="text-indent:2em;">学期末学生个人评价由过程性评价与终结性评价组成，各占50%，过程性评价由学科组长根据平时考核进行打分评价，终结性评价由各班级预赛时考核小组统一考核，按本班整体写字水平划分优（x＜40%）、良（40%≤x＜80%）、合格（80%≤x＜100%）、不合格（未能掌握基本方法）四个等次。</p>
                <p style="text-indent:2em;">期末成绩=过程性评价成绩50%+终结性评价成绩50%</p>
                <p style="color:#59BEB7;">注：过程性评价成绩（满分50分）=个人分数/班级最高分X50</p>
                <p style="text-indent:2em;">终结性成绩（满分50分  根据班级预赛情况赋予分数）</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.积极参与
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  2.作品内容正确，色彩搭配合理
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p style="border:0;">
                  3.作品能体现东莞或北区学校特色
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">资料上传</div>
              <div class="evaRight">上传照片（8张）、综合成绩（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight" v-if="evaData.length !== 0">{{evaData.等级评价}}</div>
            </div>
          </div>
          <div class="evaMain" v-show="evaData.活动名称 === '篮球嘉年华'">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>为活跃学校篮球氛围，培养学生对篮球的运动兴趣，丰富学生课余生活。增强学生体质，提高学生对篮运动的认知。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、活动时间</p>
                <p style="text-indent:2em;">4月16日</p>
                <p style="color:#59BEB7;">二、内容安排</p>
                <p style="text-indent:2em;" v-show="grade !== 207">（1）个人赛：技巧赛、传球比赛、定点投篮比赛、运球接力比赛、运球抓尾巴</p>
                <p style="text-indent:2em;" v-show="grade === 207">（1）个人赛：技巧赛、传球比赛、定点投篮比赛、运球接力比赛、单挑王</p>
                <p style="text-indent:2em;">（2）团体赛：班级篮球赛</p>
                <p style="color:#59BEB7;">三、考核管理</p>
                <p style="text-indent:2em;">学期末学生个人评价由过程性评价与终结性评价组成，各占50%，过程性评价由学科组长根据平时考核进行打分评价，终结性评价由各班级预赛时考核小组统一考核，按本班整体写字水平划分优（x＜40%）、良（40%≤x＜80%）、合格（80%≤x＜100%）、不合格（未能掌握基本方法）四个等次。</p>
                <p style="text-indent:2em;">期末成绩=过程性评价成绩50%+终结性评价成绩50%</p>
                <p style="color:#59BEB7;">注：过程性评价成绩（满分50分）=个人分数/班级最高分X50</p>
                <p style="text-indent:2em;">终结性成绩（满分50分  根据班级预赛情况赋予分数）</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.积极参与
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  2.完成各项活动的时间
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p style="border:0;">
                  3.完成各项比赛的次数
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">资料上传</div>
              <div class="evaRight">上传照片、文件、证书（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight" v-if="evaData.length !== 0">{{evaData.等级评价}}</div>
            </div>
          </div>
          <div class="evaMain" v-show="evaData.活动名称 === '舞剧节'">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>以“全面实施中小学素质教育”为核心，以“舞剧节”活动做为契机，展示学生活力，凸显学校舞剧特色，丰富校园文化，营造高雅艺术氛围，培养学生的自信心，陶冶学生情操，增强学生的集体荣誉感。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、活动时间</p>
                <p style="text-indent:2em;">5月31日</p>
                <p style="color:#59BEB7;">二、内容安排</p>
                <p style="text-indent:2em;">展示2年级舞剧“看见”</p>
                <p style="color:#59BEB7;">三、考核管理</p>
                <p style="text-indent:2em;">学期末学生个人评价由过程性评价与终结性评价组成，各占50%，过程性评价由学科组长根据平时考核进行打分评价，终结性评价由各班级预赛时考核小组统一考核，按本班整体写字水平划分优（x＜40%）、良（40%≤x＜80%）、合格（80%≤x＜100%）、不合格（未能掌握基本方法）四个等次。</p>
                <p style="text-indent:2em;">期末成绩=过程性评价成绩50%+终结性评价成绩50%</p>
                <p style="color:#59BEB7;">注：过程性评价成绩（满分50分）=个人分数/班级最高分X50</p>
                <p style="text-indent:2em;">终结性成绩（满分50分  根据班级预赛情况赋予分数）</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.积极参与
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  2.完成各项活动的时间
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p style="border:0;">
                  3.完成各项比赛的次数
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">资料上传</div>
              <div class="evaRight">上传照片（8张）、综合成绩（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight" v-if="evaData.length !== 0">{{evaData.等级评价}}</div>
            </div>
          </div>
          <div class="evaMain" v-show="evaData.活动名称 === '舞林争霸'">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>以“全面实施中小学素质教育”为核心，以“舞剧节”活动做为契机，展示学生活力，凸显学校舞剧特色，丰富校园文化，营造高雅艺术氛围，培养学生的自信心，陶冶学生情操，增强学生的集体荣誉感。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、活动时间</p>
                <p style="text-indent:2em;">5月31日</p>
                <p style="color:#59BEB7;">二、内容安排</p>
                <p style="text-indent:2em;">分1、2、3、7四个年级，以各年级为单位展示各年级舞蹈。</p>
                <p style="color:#59BEB7;">三、考核管理</p>
                <p style="text-indent:2em;">学期末学生个人评价由过程性评价与终结性评价组成，各占50%，过程性评价由学科组长根据平时考核进行打分评价，终结性评价由各班级预赛时考核小组统一考核，按本班整体写字水平划分优（x＜40%）、良（40%≤x＜80%）、合格（80%≤x＜100%）、不合格（未能掌握基本方法）四个等次。</p>
                <p style="text-indent:2em;">期末成绩=过程性评价成绩50%+终结性评价成绩50%</p>
                <p style="color:#59BEB7;">注：过程性评价成绩（满分50分）=个人分数/班级最高分X50</p>
                <p style="text-indent:2em;">终结性成绩（满分50分  根据班级预赛情况赋予分数）</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.积极参与
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  2.自信大方
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p style="border:0;">
                  3.舞姿优美、自然
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">资料上传</div>
              <div class="evaRight">上传照片（8张）、综合成绩（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight" v-if="evaData.length !== 0">{{evaData.等级评价}}</div>
            </div>
          </div>
          <div class="evaMain" v-show="evaData.活动名称 === '心理微电影'">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>以“全面实施中小学素质教育”为核心，以“舞剧节”活动做为契机，展示学生活力，凸显学校舞剧特色，丰富校园文化，营造高雅艺术氛围，培养学生的自信心，陶冶学生情操，增强学生的集体荣誉感。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、活动时间</p>
                <p style="text-indent:2em;">3月14日-4月25</p>
                <p style="color:#59BEB7;">二、内容安排</p>
                <p style="text-indent:2em;">1.全体学生，以班级为单位上交微电影作品，每班不限制作品数量，但每班不能少于1个作品（小学主要以亲子家庭组为单位参加）。</p>
                <p style="text-indent:2em;">2.初中部可班级内生生合作参赛。</p>
                <p style="color:#59BEB7;">三、考核管理</p>
                <p style="text-indent:2em;">1.内容要求</p>
                <p style="text-indent:2em;">作品要求立德树人，内容健康向上，反映当代中小学生的生活，符合中小学生的心理发展特点，突出反映出主人翁内心转化的过程，这个心理变化过程呈现自然，符合逻辑，给人以启迪，内容力求新颖、有创意。</p>
                <p style="text-indent:2em;">2.视频格式和技术要求</p>
                <p style="text-indent:2em;">（1）微电影时间应控制3-6分钟，不宜过长。</p>
                <p style="text-indent:2em;">（2）统一上交视频格式为MP4，画质流畅清晰，无闪烁、卡顿，无黑边现象；可以参考输出分辨率（分辨率1280×720（宽高比16:9），帧频24，画面码率1280K bps；声音采样率44K Hz，声音码率 128K bps ，8分钟视频约68MB；）配音普通话标准。</p>
                <p style="text-indent:2em;">期末成绩=过程性评价成绩50%+终结性评价成绩50%</p>
                <p style="color:#59BEB7;">注：过程性评价成绩（满分50分）=个人分数/班级最高分X50</p>
                <p style="text-indent:2em;">终结性成绩（满分50分  根据班级预赛情况赋予分数）</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.积极参与
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  2.主题积极
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p style="border:0;">
                  3.转化科学
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">资料上传</div>
              <div class="evaRight">上传照片（8张）、综合成绩（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight" v-if="evaData.length !== 0">{{evaData.等级评价}}</div>
            </div>
          </div>
          <div class="evaMain" v-show="evaData.活动名称 === '“创意无限 魅力魔方”争霸赛'">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>本课程旨在全员参与的过程中，培养学生的观察力、记忆力、理解力、想象力，思维力和创造力，让学生们在活动中积累体验、收获快乐、亲近数学、提升数学学科核心素养。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、活动时间</p>
                <p style="text-indent:2em;">4月14日</p>
                <p style="color:#59BEB7;">二、内容安排</p>
                <p style="text-indent:2em;">（1）个人赛：三阶魔方速拧个人赛、花样魔方个人挑战赛、花式魔方个人表演赛</p>
                <p style="text-indent:2em;">（2）团体赛：三阶魔方速拧团体赛</p>
                <p style="color:#59BEB7;">三、考核管理</p>
                <p style="text-indent:2em;">学期末学生个人评价由过程性评价与终结性评价组成，各占50%，过程性评价由学科组长根据平时考核进行打分评价，终结性评价由各班级预赛时考核小组统一考核，按本班整体写字水平划分优（x＜40%）、良（40%≤x＜80%）、合格（80%≤x＜100%）、不合格（未能掌握基本方法）四个等次。</p>
                <p style="text-indent:2em;">期末成绩=过程性评价成绩50%+终结性评价成绩50%</p>
                <p style="color:#59BEB7;">注：过程性评价成绩（满分50分）=个人分数/班级最高分X50</p>
                <p style="text-indent:2em;">终结性成绩（满分50分  根据班级预赛情况赋予分数）</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.积极参与
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  2.能将三阶魔方还原
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p style="border:0;">
                  3.能将两种不同魔方还原
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">资料上传</div>
              <div class="evaRight">上传照片（8张）、综合成绩（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight" v-if="evaData.length !== 0">{{evaData.等级评价}}</div>
            </div>
          </div>
        </div>

        <div class="page-num">
          <div class="count">{{pageObj['.pageMerak']+(index+1)*2-1}}</div>
        </div>
      </div>
  </div>
</template>
<script>
  export default {
    name: '',
    props: ['studentInformationDatas', 'pageObj', 'evaData', 'index'],
    data () {
      return {
        id: '',
        grade: ''
      }
    },
    created () {
      this.id = this.studentInformationDatas[0]['学号']
      this.grade = Number(this.id.slice(0, 3))
    },
    mounted () {
      // console.log(this.evaData)
    },
    methods: {

    }
  }
</script>
<style lang='less' scoped>
.page-merak{
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/merak/merakbg2.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  .main{
    padding-top:155px;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    .title{
      width: 856px;

    }
        h3{
      font-size: 42px;
      font-weight: 600;
      color: #FA4655;
      line-height: 36px;
      text-align: center;
    }
    .color-span{
      height: 6px;
      margin: 10px 0;
      text-align: center;
      span{
        width: 40px;
        height: 6px;
      }
      span:nth-child(1){
        display: inline-block;
        background: #F5C45B;
      }
      span:nth-child(2){
        display: inline-block;
        background: #F08C33;
      }
      span:nth-child(3){
        display: inline-block;
        background: #D44953;
      }
      span:nth-child(4){
        display: inline-block;
        background: #851C3C;
      }
      span:nth-child(5){
        display: inline-block;
        background: #084F7A;
      }
      span:nth-child(6){
        display: inline-block;
        background: #3AA7D3;
      }
      span:nth-child(7){
        display: inline-block;
        background: #66C3CC;
      }
      span:nth-child(8){
        display: inline-block;
        background: #72C3AD;
      }
    }
      .evalute {
      border: 1px solid #59BEB7;

      font-size: 14px;
      line-height: 26px;
      width: 856px;
      transform: translateY(-2px);
      margin: 35px 0 32px;
      .evaHeader {
        height: 46px;
        background: #59BEB7;
        color: #fefefe;
        font-size: 24px;
        text-align: center;
        line-height: 46px;
      }
    }
  }
}
.page-num {
  width: 100%;
  height: 30px;
  background: url('./../../views/qualityReport/img/pageNum2.png') no-repeat;
    background-size: 100% 100%;
    position: absolute;
    bottom: 50px;
    .count{
    text-align: center;
    line-height: 30px;
    }
}

.evaMain {
  font-size: 14px;
  color: #231916;
  >div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #59BEB7;
    .evaLeft {
      width: 94px;
      text-align: center;
    }
    .evaRight {
      width: 100%;
      border-left: 1px solid #59BEB7;
      padding: 8px 20px 8px 20px;
    }
  }
  .line:nth-child(2) .evaRight {
    height: 810px;
  }
  .line2 {
    .evaRight {
      padding: 0 0 0 16px;
    }
  }
  .lineS {
    .evaRight {
      padding: 0;
      p {
        padding-left: 16px;
        border-bottom: 1px solid #59BEB7;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          display: inline-block;
          width: 190px;
          border-left: 1px solid #59BEB7;
          text-align: center;
        }
      }
    }
  }
}
</style>
