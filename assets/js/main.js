// Main JavaScript file for Child Safety Website

document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation for navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add loading state
            this.style.opacity = '0.7';
            this.style.transform = 'scale(0.95)';
            
            // Reset after a short delay (for visual feedback)
            setTimeout(() => {
                this.style.opacity = '';
                this.style.transform = '';
            }, 200);
        });
    });

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.awareness-card, .nav-button, .contact-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Add hover sound effect (optional)
    navButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            // You can add sound effects here if needed
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // Phone number click to call functionality
    const phoneNumber = document.querySelector('.phone-number');
    if (phoneNumber) {
        phoneNumber.addEventListener('click', function() {
            window.location.href = 'tel:1800900700';
        });
        
        // Make it look clickable
        phoneNumber.style.cursor = 'pointer';
        phoneNumber.title = 'اضغط للاتصال';
    }

    // Language toggle (simple, persists selection)
    const langArBtn = document.getElementById('langAr');
    const langEnBtn = document.getElementById('langEn');
    const creditsAr = document.getElementById('creditsAr');
    const creditsEn = document.getElementById('creditsEn');

    // Translations dictionary for pages (keys match data-i18n attributes)
    const translations = {
        // ---- Home page ----
        siteTitle: { ar: 'حدّث طفلك', en: "Connect With Your Child" },
        subtitle: { ar: 'موقع توعوي لحماية الأطفال', en: 'An awareness site for child protection' },
        awarenessTitle: { ar: 'توعية ممتازة', en: 'Excellent Awareness' },
        awarenessText: { ar: 'نساعد العائلات على اكتساب الوعي الكافي حول كيفية التعامل مع المواقف الحساسة التي قد يتعرض لها أطفالهم، مثل المضايقة أو التحرش أو التنمر.', en: 'We help families gain sufficient awareness on how to handle sensitive situations their children may face, such as harassment or bullying.' },
        nav_wrong_title: { ar: 'لمسة خاطئة', en: 'Wrong Touch' },
        nav_wrong_text: { ar: 'تعليم الطفل التمييز بين اللمسات الآمنة وغير الآمنة', en: 'Teach the child to distinguish safe from unsafe touches' },
        nav_asks_title: { ar: 'لو طفلك سألك', en: 'If Your Child Asks' },
        nav_asks_text: { ar: 'أسئلة وأجوبة للتعامل مع استفسارات الأطفال', en: 'Q&A for handling children’s questions' },
        nav_educate_title: { ar: 'تثقف', en: 'Educate' },
        nav_educate_text: { ar: 'العلامات التي قد تشير إلى وجود تحرش أو مضايقة', en: 'Signs that may indicate harassment or abuse' },
        nav_ask_title: { ar: 'اسأل', en: 'Ask' },
        nav_ask_text: { ar: 'تحدث مع مساعد ذكي للحصول على إرشادات فورية', en: 'Talk to a smart assistant for immediate guidance' },
        nav_draw_title: { ar: 'لوحة الرسم', en: 'Drawing Board' },
        nav_draw_text: { ar: 'ارسم مشاعرك وتحدث عنها بأمان', en: 'Draw your feelings and talk about them safely' },
        contactTitle: { ar: 'في حالات الطوارى يمكن الاتصال على خط شباك الشباب', en: 'In emergencies contact the Youth Help Line' },
        phoneNumber: { ar: '1800 900 700', en: '1800 900 700' },
        contactText: { ar: 'خط مساعدة مجاني بإشراف أخصائيات متاح للاستشارات العاجلة يومياً من ٨ صباحاً حتى ٧ مساءً.', en: 'A free helpline supervised by specialists available daily for urgent consultations from 8 AM to 7 PM.' },

        // ---- Shared across pages ----
        back_home: { ar: '← العودة للرئيسية', en: '← Back to Home' },
        emergency_now_title: { ar: 'في حالات الطوارئ', en: 'In Emergencies' },
        emergency_help_title: { ar: 'للمساعدة الفورية', en: 'For Immediate Help' },
        helpline_note_247: { ar: 'خط مساعدة مجاني متاح 24/7 للاستشارات العاجلة', en: 'A free helpline available 24/7 for urgent consultations' },

        // ---- Wrong Touch page ----
        wt_title: { ar: 'لمسة خاطئة', en: 'Wrong Touch' },
        wt_subtitle: { ar: 'تعليم الطفل التمييز بين اللمسات الآمنة وغير الآمنة', en: 'Teach the child to distinguish safe from unsafe touches' },
        wt_selectGenderTitle: { ar: 'اختر جنس الطفل', en: "Choose the child's gender" },
        wt_selectGenderText: { ar: 'اختر الشخصية المناسبة لتعليم طفلك', en: 'Choose the right character to teach your child' },
        wt_girl: { ar: 'بنت', en: 'Girl' },
        wt_boy: { ar: 'ولد', en: 'Boy' },
        wt_part_mouth: { ar: 'الفم', en: 'Mouth' },
        wt_part_hand: { ar: 'اليد', en: 'Hand' },
        wt_part_private: { ar: 'المنطقة الخاصة', en: 'Private Area' },
        wt_part_chest: { ar: 'الصدر', en: 'Chest' },
        wt_part_leg: { ar: 'الرجل', en: 'Leg' },
        wt_info_default_title: { ar: 'اضغط على أي جزء من الجسم لتعلم المزيد', en: 'Tap any body part to learn more' },
        wt_info_default_text: { ar: 'اختر جزءاً من الجسم لتتعلم عنه وعن اللمسات الآمنة وغير الآمنة.', en: 'Choose a body part to learn about it and about safe and unsafe touches.' },
        wt_changeCharacter: { ar: 'تغيير الشخصية', en: 'Change character' },

        // ---- If Your Child Asks page ----
        qa_subtitle: { ar: 'أسئلة وأجوبة للتعامل مع استفسارات الأطفال', en: "Q&A for handling children's questions" },
        qa_intro_title: { ar: 'دليل الإجابات للوالدين', en: 'A Guide to Answers for Parents' },
        qa_intro_text: { ar: 'إرشادات مهمة للتعامل مع الأسئلة الحساسة التي قد يطرحها طفلك', en: 'Important guidance for handling the sensitive questions your child may ask' },
        qa_answer_title: { ar: 'الأوامر للأهل/المجتمع:', en: 'Guidance for parents/community:' },
        qa1_title: { ar: 'المواقف مع المعلم/ة أو الكبار', en: 'Situations with a Teacher or Adults' },
        qa1_q: { ar: '"إذا معلم/ة أو حدا أكبر مني طلب يشوف جسمي وأنا مستحي، كيف لازم أتصرف؟"', en: '"If a teacher or someone older than me asks to see my body and I feel shy, how should I act?"' },
        qa1_1: { ar: 'قل للطفل إنه يحق له قول "لا" بكل هدوء.', en: 'Tell the child that they have the right to calmly say "no".' },
        qa1_2: { ar: 'ساعد الطفل على الابتعاد فوراً عن الشخص إذا شعر بعدم الراحة.', en: 'Help the child move away from the person immediately if they feel uncomfortable.' },
        qa1_3: { ar: 'طمئن الطفل وذكّره أنه بأمان وأنك معه طوال الوقت.', en: 'Reassure the child and remind them that they are safe and that you are with them at all times.' },
        qa1_4: { ar: 'اطلب من الطفل إخبارك فوراً بما حدث.', en: 'Ask the child to tell you immediately what happened.' },
        qa1_5: { ar: 'أخبر إدارة المدرسة أو شخص كبير موثوق في المدرسة لحماية الطفل.', en: 'Inform the school administration or a trusted adult at school to protect the child.' },
        qa2_title: { ar: 'الهدايا أو الإغراءات مقابل شيء غير مريح', en: 'Gifts or Bribes in Exchange for Something Uncomfortable' },
        qa2_q: { ar: '"إذا حد عطاني هدية وقال لي لازم أعمل شي وإذا ما عملت ما رح يدي الهدية، شو لازم أعمل؟"', en: '"If someone gives me a gift and says I must do something, and if I don\'t they won\'t give me the gift, what should I do?"' },
        qa2_1: { ar: 'علّم الطفل أنه لا يوجد شيء يفرض عليه أن يفعل ما يرفضه جسده.', en: 'Teach the child that nothing can force them to do something their body refuses.' },
        qa2_2: { ar: 'شجّع الطفل على قول "لا" مهما كانت قيمة الهدية.', en: 'Encourage the child to say "no" regardless of the value of the gift.' },
        qa2_3: { ar: 'اطلب من الطفل إبلاغك فوراً إذا حاول أحد الضغط عليه.', en: 'Ask the child to tell you immediately if someone tries to pressure them.' },
        qa2_4: { ar: 'راقب الموقف وتأكد أن الطفل بأمان.', en: 'Monitor the situation and make sure the child is safe.' },
        qa3_title: { ar: 'الإبلاغ وسرية المعلومات', en: 'Reporting and Confidentiality' },
        qa3_q: { ar: '"إذا حكيتلك، هل رح تخبر حدا تاني؟ مين رح يعرف؟"', en: '"If I tell you, will you tell someone else? Who will know?"' },
        qa3_1: { ar: 'اشرح للطفل من سيعرف ولماذا، قبل اتخاذ أي إجراء.', en: 'Explain to the child who will know and why, before taking any action.' },
        qa3_2: { ar: 'أخبر الطفل أنه سيتم إشراك أشخاص يمكنهم مساعدته (مدرس/ة، جهة حماية الطفل، أو الشرطة لو الأمر خطير).', en: 'Tell the child that people who can help will be involved (a teacher, a child-protection agency, or the police if it is serious).' },
        qa3_3: { ar: 'ضمن أن الهدف حماية الطفل وليس العقاب.', en: 'Assure them the goal is to protect the child, not to punish.' },
        qa3_4: { ar: 'دع الطفل يشعر بالأمان والدعم طوال العملية.', en: 'Let the child feel safe and supported throughout the process.' },
        qa_notes_title: { ar: 'ملاحظات مهمة للوالدين', en: 'Important Notes for Parents' },
        qa_note1: { ar: '<strong>الهدوء والصبر:</strong> تعامل مع أسئلة طفلك بهدوء وصبر، ولا تظهر الخوف أو القلق الزائد.', en: '<strong>Calm and patience:</strong> Handle your child\'s questions with calm and patience, and don\'t show fear or excessive worry.' },
        qa_note2: { ar: '<strong>الصدق المناسب:</strong> أجب بصدق ولكن بطريقة مناسبة لعمر الطفل وقدرته على الفهم.', en: '<strong>Age-appropriate honesty:</strong> Answer honestly but in a way suitable for the child\'s age and understanding.' },
        qa_note3: { ar: '<strong>التشجيع على التواصل:</strong> شجع طفلك دائماً على طرح الأسئلة والتحدث معك عن أي شيء يقلقه.', en: '<strong>Encouraging communication:</strong> Always encourage your child to ask questions and talk to you about anything that worries them.' },
        qa_note4: { ar: '<strong>طلب المساعدة:</strong> لا تتردد في طلب المساعدة من المختصين إذا كنت تحتاج لإرشادات إضافية.', en: '<strong>Seeking help:</strong> Don\'t hesitate to seek help from specialists if you need further guidance.' },

        // ---- Educate page ----
        ed_title: { ar: 'تثقف', en: 'Educate' },
        ed_subtitle: { ar: 'دراسات واحصائيات ،والعلامات التي قد تشير إلى وجود تحرش أو مضايقة.', en: 'Studies, statistics, and the signs that may indicate abuse or harassment.' },
        ed_studies_title: { ar: 'دراسات وإحصائيات', en: 'Studies & Statistics' },
        ed_intro_title: { ar: 'دليل التعرف على العلامات التحذيرية', en: 'A Guide to Recognizing Warning Signs' },
        ed_intro_text: { ar: 'معرفة العلامات المبكرة يمكن أن تساعد في حماية طفلك وتوفير المساعدة في الوقت المناسب', en: 'Knowing the early signs can help protect your child and provide help at the right time' },
        ed_warning: { ar: '<strong>تنبيه مهم:</strong> وجود علامة واحدة أو أكثر لا يعني بالضرورة حدوث تحرش، ولكنها تستدعي الانتباه والمتابعة الحذرة.', en: '<strong>Important note:</strong> The presence of one or more signs does not necessarily mean abuse occurred, but it calls for attention and careful follow-up.' },
        ed_physical_title: { ar: '1. علامات جسدية', en: '1. Physical Signs' },
        ed_ph1_h: { ar: 'ألم أو حكة في المناطق الحساسة', en: 'Pain or itching in sensitive areas' },
        ed_ph1_p: { ar: 'ألم أو حكة في منطقة الأعضاء التناسلية أو الشرج دون سبب طبي واضح.', en: 'Pain or itching in the genital or anal area with no clear medical cause.' },
        ed_ph2_h: { ar: 'نزيف أو جروح غير مبررة', en: 'Unexplained bleeding or wounds' },
        ed_ph2_p: { ar: 'نزيف أو جروح أو كدمات غير مبرَّرة في الأعضاء التناسلية أو الشرج.', en: 'Unexplained bleeding, wounds, or bruises in the genital or anal area.' },
        ed_ph3_h: { ar: 'التهابات متكررة', en: 'Recurrent infections' },
        ed_ph3_p: { ar: 'التهابات بولية متكرّرة أو التهابات مهبليّة بدون سبب معروف.', en: 'Recurrent urinary or vaginal infections with no known cause.' },
        ed_ph4_h: { ar: 'تغييرات في الأنماط البدنية', en: 'Changes in physical patterns' },
        ed_ph4_p: { ar: 'سلس البول أو التبول الليلي بعد أن يكون الطفل متحكمًا عادة.', en: 'Bed-wetting or incontinence after the child had normally been in control.' },
        ed_ph5_h: { ar: 'بقع على الملابس', en: 'Stains on clothing' },
        ed_ph5_p: { ar: 'نزول دم على الملابس الداخلية أو بقع ملحوظة عليها.', en: 'Blood on the underwear or noticeable stains on it.' },
        ed_behavioral_title: { ar: '2. علامات سلوكية / عاطفية', en: '2. Behavioral / Emotional Signs' },
        ed_be1_h: { ar: 'تغيّرات مفاجئة في السلوك', en: 'Sudden changes in behavior' },
        ed_be1_p: { ar: 'الانعزال، الخجل، الحذر الشديد، أو الخوف من شخص أو مكان معين.', en: 'Withdrawal, shyness, extreme wariness, or fear of a specific person or place.' },
        ed_be2_h: { ar: 'اضطرابات النوم', en: 'Sleep disturbances' },
        ed_be2_p: { ar: 'كوابيس أو اضطرابات في النوم، رفض النوم بمفرده، خوف من الذهاب إلى السرير.', en: 'Nightmares or sleep problems, refusing to sleep alone, fear of going to bed.' },
        ed_be3_h: { ar: 'تدهور الأداء المدرسي', en: 'Declining school performance' },
        ed_be3_p: { ar: 'تدهور في الأداء المدرسي أو الغياب المتكرر عن المدرسة.', en: 'A decline in school performance or frequent absence from school.' },
        ed_be4_h: { ar: 'معرفة جنسية غير مناسبة', en: 'Age-inappropriate sexual knowledge' },
        ed_be4_p: { ar: 'استخدام كلمات جنسية لا يفهمها عادة الأطفال بهذا السن، أو تمثيل أدوار جنسية في اللعب.', en: 'Using sexual words children of that age don\'t usually understand, or acting out sexual roles in play.' },
        ed_be5_h: { ar: 'تغيرات في العدوانية', en: 'Changes in aggression' },
        ed_be5_p: { ar: 'عدوانية مفاجئة أو سلوك عنيف، أو على العكس فرط الطاعة والخنوع الشديد.', en: 'Sudden aggression or violent behavior, or conversely excessive obedience and submissiveness.' },
        ed_be6_h: { ar: 'تراجع في المهارات', en: 'Regression in skills' },
        ed_be6_p: { ar: 'تراجع في بعض المهارات التي تعلمها الطفل سابقًا مثل الكلام أو اللغة.', en: 'Regression in skills the child had previously learned, such as speech or language.' },
        ed_be7_h: { ar: 'أعراض جسدية نفسية', en: 'Psychosomatic symptoms' },
        ed_be7_p: { ar: 'ألم في البطن أو الصداع المتكرر بدون سبب طبي واضح.', en: 'Stomach pain or frequent headaches with no clear medical cause.' },
        ed_be8_h: { ar: 'مشاعر سلبية', en: 'Negative feelings' },
        ed_be8_p: { ar: 'مشاعر الحزن أو الخجل أو الشعور بالذنب، انخفاض الثقة بالنفس.', en: 'Feelings of sadness, shame, or guilt, and low self-confidence.' },
        ed_action_title: { ar: 'ماذا تفعل إذا لاحظت هذه العلامات؟', en: 'What to do if you notice these signs?' },
        ed_ac1_h: { ar: 'ابق هادئاً', en: 'Stay calm' },
        ed_ac1_p: { ar: 'لا تظهر الذعر أو القلق الشديد أمام الطفل، حافظ على هدوئك وتماسكك.', en: 'Don\'t show panic or extreme worry in front of the child; stay calm and composed.' },
        ed_ac2_h: { ar: 'تحدث مع الطفل', en: 'Talk with the child' },
        ed_ac2_p: { ar: 'اختر وقتاً مناسباً وتحدث مع الطفل بلطف وصبر، دون إجباره على الكلام.', en: 'Choose a suitable time and talk to the child gently and patiently, without forcing them to speak.' },
        ed_ac3_h: { ar: 'استشر مختصاً', en: 'Consult a specialist' },
        ed_ac3_p: { ar: 'تواصل مع طبيب الأطفال أو مختص نفسي للحصول على التوجيه المناسب.', en: 'Contact a pediatrician or a psychologist for appropriate guidance.' },
        ed_ac4_h: { ar: 'وثق الملاحظات', en: 'Document your observations' },
        ed_ac4_p: { ar: 'اكتب ملاحظاتك حول السلوكيات والعلامات التي لاحظتها مع التواريخ.', en: 'Write down your observations about the behaviors and signs you noticed, with dates.' },
        ed_resources_title: { ar: 'مصادر موثوقة لتفاصيل أكثر', en: 'Trusted Sources for More Details' },
        ed_res1_p: { ar: 'قسم أعراض وعلامات إساءة الأطفال والتحرش الجنسي', en: 'Section on symptoms and signs of child abuse and sexual abuse' },
        ed_res2_p: { ar: 'تحديد العلامات الجسدية والسلوكية', en: 'Identifying physical and behavioral signs' },
        ed_res3_h: { ar: 'NHS (الخدمات الصحية الوطنية في بريطانيا)', en: 'NHS (UK National Health Service)' },
        ed_res3_p: { ar: 'خطوات ما تفعله إذا اشتبهت بالتحرش', en: 'Steps for what to do if you suspect abuse' },
        ed_res4_p: { ar: 'تعريف العلامات العاطفية والجسدية، وتحذير من استدراج الطفل', en: 'Defining emotional and physical signs, and warning about grooming' },

        // ---- Ask page ----
        ask_title: { ar: 'اسأل', en: 'Ask' },
        ask_subtitle: { ar: 'تحدث مع مساعد ذكي للحصول على إرشادات فورية', en: 'Talk to a smart assistant for immediate guidance' },
        ask_intro_title: { ar: 'مساعد ذكي للإرشاد والدعم', en: 'A Smart Assistant for Guidance and Support' },
        ask_intro_text: { ar: 'اطرح أسئلتك واحصل على إرشادات فورية حول كيفية التعامل مع المواقف الحساسة', en: 'Ask your questions and get instant guidance on how to handle sensitive situations' },
        ask_bot_name: { ar: 'مساعد حماية الأطفال', en: 'Child Protection Assistant' },
        ask_status_online: { ar: 'متصل', en: 'Online' },
        ask_welcome: { ar: 'مرحباً! أنا مساعدك الذكي لحماية الأطفال. يمكنني مساعدتك في:<br><br>• الإجابة على أسئلة حول سلامة الأطفال<br>• تقديم نصائح للتعامل مع المواقف الحساسة<br>• إرشادك لطلب المساعدة المناسبة<br><br>كيف يمكنني مساعدتك اليوم؟', en: 'Hello! I am your smart child-protection assistant. I can help you with:<br><br>• Answering questions about child safety<br>• Giving advice on handling sensitive situations<br>• Guiding you to seek the right help<br><br>How can I help you today?' },
        ask_now: { ar: 'الآن', en: 'Now' },
        ask_suggestions_title: { ar: 'أسئلة شائعة:', en: 'Common questions:' },
        ask_suggestion1: { ar: 'كيف أتحدث مع طفلي عن سلامة الجسم؟', en: 'How do I talk to my child about body safety?' },
        ask_suggestion2: { ar: 'ما هي العلامات التي تدل على تعرض الطفل للتحرش؟', en: 'What are the signs that a child has been abused?' },
        ask_suggestion3: { ar: 'كيف أتعامل إذا أخبرني طفلي بحادثة مؤذية؟', en: 'How do I respond if my child tells me about a harmful incident?' },
        ask_suggestion4: { ar: 'متى يجب أن أطلب المساعدة المهنية؟', en: 'When should I seek professional help?' },
        ask_input_ph: { ar: 'اكتب سؤالك هنا...', en: 'Type your question here...' },
        ask_typing: { ar: 'المساعد يكتب...', en: 'The assistant is typing...' },
        ask_notice_title: { ar: 'تنبيه مهم', en: 'Important Notice' },
        ask_notice_text: { ar: 'هذا المساعد الذكي يقدم إرشادات عامة فقط ولا يغني عن الاستشارة المهنية. في حالات الطوارئ أو الشك في وجود خطر فوري، يرجى الاتصال بخط المساعدة أو الجهات المختصة.', en: 'This smart assistant provides general guidance only and is not a substitute for professional consultation. In emergencies or if you suspect immediate danger, please call the helpline or the relevant authorities.' },

        // ---- Drawing Board page ----
        dr_title: { ar: 'لوحة الرسم', en: 'Drawing Board' },
        dr_subtitle: { ar: 'ارسم مشاعرك وتحدث عنها', en: 'Draw your feelings and talk about them' },
        dr_activities_title: { ar: 'اختر نشاطاً 🎨', en: 'Choose an activity 🎨' },
        dr_free_title: { ar: 'رسم حر', en: 'Free Drawing' },
        dr_free_text: { ar: 'ارسم أي شيء تحبه', en: 'Draw anything you like' },
        dr_trusted_title: { ar: 'الكبار الموثوقون', en: 'Trusted Adults' },
        dr_trusted_text: { ar: 'ارسم من تشعر بالأمان معهم', en: 'Draw the people you feel safe with' },
        dr_body_title: { ar: 'أمان الجسم', en: 'Body Safety' },
        dr_body_text: { ar: 'جسمك لك أنت', en: 'Your body belongs to you' },
        dr_safe_title: { ar: 'آمن أو غير آمن', en: 'Safe or Unsafe' },
        dr_safe_text: { ar: 'ارسم شعوراً بالأمان', en: 'Draw a feeling of safety' },
        dr_help_title: { ar: 'اطلب المساعدة', en: 'Asking for Help' },
        dr_help_text: { ar: 'ارسم كيف تطلب المساعدة', en: 'Draw how you ask for help' },
        dr_tool_color: { ar: 'الألوان', en: 'Colors' },
        dr_tool_brush: { ar: 'حجم الفرشاة', en: 'Brush size' },
        dr_tool_eraser: { ar: 'ممحاة', en: 'Eraser' },
        dr_tool_undo: { ar: 'تراجع', en: 'Undo' },
        dr_tool_clear: { ar: 'مسح الكل', en: 'Clear all' },
        dr_tool_save: { ar: 'حفظ الرسمة', en: 'Save picture' },
        dr_done: { ar: '✅ خلّصت! خلّينا نحكي عن رسمتي', en: "✅ I'm done! Let's talk about my drawing" },
        dr_talk_title: { ar: 'أخبرني عن رسمتك 💛', en: 'Tell me about your drawing 💛' },
        dr_feeling_q: { ar: 'كيف تشعر اليوم؟', en: 'How do you feel today?' },
        dr_input_ph: { ar: 'اكتب هنا عن رسمتك...', en: 'Write here about your drawing...' },
        dr_send: { ar: 'إرسال', en: 'Send' },
        dr_privacy_note: { ar: '🔒 رسوماتك وكلامك خاصة بك ومحفوظة على جهازك فقط.', en: '🔒 Your drawings and words are private and stored only on your device.' },
        dr_parents_btn: { ar: '👨‍👩‍👧 ركن الوالدين', en: "👨‍👩‍👧 Parents' Corner" },
        dr_parents_title: { ar: 'ملخص داعم للوالدين', en: 'A Supportive Summary for Parents' },
        dr_parents_intro: { ar: 'هذه ملاحظات لطيفة قد تساعدك على بدء حوار مع طفلك. إنها <strong>أنماط محتملة وليست تشخيصاً</strong>، ولا تعني بالضرورة وجود مشكلة.', en: 'These are gentle notes that may help you start a conversation with your child. They are <strong>possible patterns, not a diagnosis</strong>, and do not necessarily mean anything is wrong.' },
        dr_parents_patterns: { ar: 'أنماط قد تلاحظها', en: 'Patterns you may notice' },
        dr_parents_starters: { ar: 'أفكار لبدء الحديث', en: 'Conversation starters' },
        dr_parents_none: { ar: 'لا توجد معلومات كافية بعد. شجّع طفلك على الرسم والتحدث عن رسوماته.', en: 'Not enough information yet. Encourage your child to draw and talk about their pictures.' },
        dr_parents_disclaimer: { ar: '⚠️ هذه الأداة لا تُشخّص الإساءة ولا تستبدل المختصين. إذا كنت قلقاً، تحدث مع طفلك بهدوء واطلب المساعدة من مختص أو اتصل بخط المساعدة 1800 900 700.', en: '⚠️ This tool does not diagnose abuse and does not replace professionals. If you are worried, talk to your child calmly and seek help from a specialist or call the helpline 1800 900 700.' },
        dr_reset: { ar: 'ابدأ رسمة جديدة', en: 'Start a new drawing' },
        dr_close: { ar: 'إغلاق', en: 'Close' }
    };
    // Expose translations and current language so per-page scripts can localize
    // dynamically generated content.
    window.siteTranslations = translations;
    window.getSiteLang = function () {
        try { return localStorage.getItem('siteLang') === 'en' ? 'en' : 'ar'; } catch (e) { return 'ar'; }
    };

    function applyLanguage(lang) {
        if (lang === 'en') {
            if (creditsAr) creditsAr.style.display = 'none';
            if (creditsEn) creditsEn.style.display = 'block';
            document.documentElement.lang = 'en';
            document.documentElement.dir = 'ltr';
        } else {
            if (creditsAr) creditsAr.style.display = 'block';
            if (creditsEn) creditsEn.style.display = 'none';
            document.documentElement.lang = 'ar';
            document.documentElement.dir = 'rtl';
        }
        // The stylesheet hard-codes `body { direction: rtl }`, which overrides the
        // dir attribute above. Set it inline on <body> so the whole page flips:
        // right-to-left for Arabic, left-to-right for English.
        if (document.body) {
            document.body.style.direction = lang === 'en' ? 'ltr' : 'rtl';
        }
        // show only the button that switches to the other language
        if (langArBtn && langEnBtn) {
            if (lang === 'en') {
                langEnBtn.style.display = 'none';
                langArBtn.style.display = 'inline-flex';
            } else {
                langArBtn.style.display = 'none';
                langEnBtn.style.display = 'inline-flex';
            }
        }

        // update all translatable texts for the selected language
        try { updateTexts(lang); } catch (e) {}

        try { localStorage.setItem('siteLang', lang); } catch (e) {}

        // let per-page scripts re-render any dynamically generated content
        try { document.dispatchEvent(new CustomEvent('sitelangchange', { detail: { lang: lang } })); } catch (e) {}
    }

    // Update any elements with data-i18n / data-i18n-ph / data-i18n-title
    function updateTexts(lang) {
        // Text content (may contain simple inline HTML like <br> or <strong>)
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                el.innerHTML = translations[key][lang] || translations[key].ar || '';
            }
        });
        // Input placeholders
        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const key = el.getAttribute('data-i18n-ph');
            if (translations[key]) {
                el.setAttribute('placeholder', translations[key][lang] || translations[key].ar || '');
            }
        });
        // Element titles / tooltips
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (translations[key]) {
                el.setAttribute('title', translations[key][lang] || translations[key].ar || '');
            }
        });
        // Blocks that only appear in one language (rich content kept as full HTML)
        document.querySelectorAll('.only-ar').forEach(el => {
            el.style.display = lang === 'ar' ? '' : 'none';
        });
        document.querySelectorAll('.only-en').forEach(el => {
            el.style.display = lang === 'en' ? '' : 'none';
        });
    }

    // Wire up the toggle buttons when present on the page
    if (langArBtn && langEnBtn) {
        langArBtn.addEventListener('click', () => applyLanguage('ar'));
        langEnBtn.addEventListener('click', () => applyLanguage('en'));
    }

    // Initialize language on every page (subpages may not have toggle buttons,
    // but should still honor the saved language and translate their content)
    const saved = (function(){ try { return localStorage.getItem('siteLang'); } catch(e){ return null;} })();
    const initial = saved === 'en' ? 'en' : 'ar';
    applyLanguage(initial);

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
});

// Utility function to show loading state
function showLoading(element) {
    element.innerHTML = '<div class="loading-spinner">جاري التحميل...</div>';
}

// Utility function to hide loading state
function hideLoading(element, originalContent) {
    element.innerHTML = originalContent;
}

// Add CSS for keyboard navigation
const style = document.createElement('style');
style.textContent = `
    .keyboard-navigation .nav-button:focus {
        outline: 3px solid #4299e1;
        outline-offset: 2px;
    }
    
    .loading-spinner {
        display: inline-block;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;




