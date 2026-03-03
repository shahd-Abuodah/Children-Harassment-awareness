// Drawing Board — a communication & emotional-expression tool for children.
// SAFETY PRINCIPLES (must not change):
//  - The AI NEVER diagnoses abuse or draws conclusions from a drawing.
//  - It only asks gentle, age-appropriate, open-ended questions.
//  - Emotional themes are stored locally as *possible patterns*, never facts.
//  - Everything is bilingual (AR/EN) and follows the site language + direction.

(function () {
    'use strict';

    // ---- Language helpers ----
    function drLang() {
        return (typeof window.getSiteLang === 'function') ? window.getSiteLang() : 'ar';
    }
    function t(pair) { return pair[drLang()] || pair.ar; }

    // ---- Localized dynamic content ----
    const DR = {
        // Prompt shown in the banner for each activity
        prompts: {
            free:    { ar: 'ارسم أي شيء يدور في بالك اليوم 🎨', en: 'Draw anything on your mind today 🎨' },
            trusted: { ar: 'ارسم الأشخاص الذين تشعر بالأمان والراحة معهم 🤝', en: 'Draw the people you feel safe and comfortable with 🤝' },
            body:    { ar: 'جسمك ملكك! المناطق التي يغطّيها لباس السباحة خاصّة بك وحدك. ارسم نفسك 🧍', en: 'Your body is yours! The parts a swimsuit covers are private, just for you. Draw yourself 🧍' },
            safe:    { ar: 'ارسم مكاناً أو لحظة تشعرك بالأمان 🛡️', en: 'Draw a place or moment that makes you feel safe 🛡️' },
            help:    { ar: 'ارسم شخصاً يمكنك أن تطلب منه المساعدة عندما تحتاج 🆘', en: 'Draw someone you can ask for help when you need it 🆘' }
        },
        // Warm opener for the talk panel
        botIntro: { ar: 'رسمة جميلة! 🌟 خبّرني، شو رسمت؟', en: 'What a lovely picture! 🌟 Tell me, what did you draw?' },
        // First question tuned per activity (used to open the conversation)
        firstQuestion: {
            free:    { ar: 'شو رسمت في صورتك؟', en: 'What did you draw in your picture?' },
            trusted: { ar: 'مين رسمت؟ وليش بتحس بالأمان معهم؟', en: 'Who did you draw? Why do you feel safe with them?' },
            body:    { ar: 'أحسنت! بتتذكّر إنّ المناطق الخاصّة إلك أنت وحدك؟', en: 'Great! Do you remember that your private parts are just for you?' },
            safe:    { ar: 'شو اللي بيخلّي هالمكان آمن برأيك؟', en: 'What makes this place feel safe to you?' },
            help:    { ar: 'مين بيقدر يساعدك في رسمتك؟', en: 'Who can help you in your picture?' }
        },
        // Fallback question bank (used when the AI is unavailable)
        followUps: {
            ar: [
                'مين الأشخاص الموجودين في رسمتك؟',
                'ليش اخترت هالألوان؟',
                'كيف بيحسّوا الأشخاص في الصورة؟',
                'شو أكثر جزء بتحبّه في رسمتك؟',
                'شو اللي عم بيصير في الصورة؟',
                'في إشي بتحب تضيفه على رسمتك؟',
                'وين بتحب تكون في رسمتك؟'
            ],
            en: [
                'Who are the people in your picture?',
                'Why did you pick these colors?',
                'How do the people in the picture feel?',
                'What part of your drawing do you like the most?',
                'What is happening in your picture?',
                'Is there anything you would like to add?',
                'Where would you like to be in your picture?'
            ]
        },
        // Short affirmations shown before a follow-up question
        acks: {
            ar: ['شكراً لمشاركتك 💛', 'هذا جميل!', 'أحسنت! 🌟', 'فهمت 🙂', 'حلو كتير!'],
            en: ['Thanks for sharing 💛', "That's lovely!", 'Well done! 🌟', 'I see 🙂', 'So nice!']
        },
        // Feelings (child-friendly, also used for theme tagging)
        feelings: [
            { id: 'happy',  emoji: '😊', label: { ar: 'سعيد', en: 'Happy' },  theme: 'positive' },
            { id: 'calm',   emoji: '😌', label: { ar: 'هادئ', en: 'Calm' },   theme: 'positive' },
            { id: 'sad',    emoji: '😢', label: { ar: 'حزين', en: 'Sad' },    theme: 'sadness' },
            { id: 'scared', emoji: '😨', label: { ar: 'خائف', en: 'Scared' }, theme: 'fear' },
            { id: 'angry',  emoji: '😠', label: { ar: 'غاضب', en: 'Angry' },  theme: 'anger' },
            { id: 'lonely', emoji: '😔', label: { ar: 'وحيد', en: 'Lonely' }, theme: 'isolation' }
        ],
        // Emotional themes — possible patterns, NEVER diagnoses.
        themes: {
            positive:  { emoji: '🌟', label: { ar: 'مشاعر إيجابية وأمان', en: 'Positive & safe feelings' },
                         starter: { ar: 'اسأل طفلك عمّا يجعله سعيداً ويمنحه شعوراً بالأمان، واحتفِ بذلك معه.', en: 'Ask your child what makes them happy and safe, and celebrate it together.' } },
            sadness:   { emoji: '💧', label: { ar: 'حزن متكرر', en: 'Recurring sadness' },
                         starter: { ar: '"لاحظت إنك رسمت أشياء حزينة… بتحب تحكيلي شو بيحزنك؟" استمع دون حكم.', en: '"I noticed some sad pictures… would you like to tell me what makes you sad?" Listen without judging.' } },
            fear:      { emoji: '🫂', label: { ar: 'خوف متكرر', en: 'Recurring fear' },
                         starter: { ar: '"شو الإشي اللي بيخوّفك أحياناً؟ أنا موجود لأحميك." طمئنه أنه بأمان معك.', en: '"What sometimes scares you? I am here to keep you safe." Reassure them they are safe with you.' } },
            isolation: { emoji: '🤝', label: { ar: 'شعور بالوحدة', en: 'Feeling lonely' },
                         starter: { ar: 'خصّص وقتاً هادئاً مع طفلك واسأله بلطف مع من يحب أن يلعب ويقضي وقته.', en: 'Spend quiet time together and gently ask who your child likes to play and spend time with.' } },
            anger:     { emoji: '🌈', label: { ar: 'غضب أو إحباط', en: 'Anger or frustration' },
                         starter: { ar: 'ساعد طفلك على تسمية مشاعره: "شكلك زعلان، بتحب تحكيلي شو صار؟"', en: 'Help your child name feelings: "You seem upset — do you want to tell me what happened?"' } },
            unsafe:    { emoji: '💛', label: { ar: 'مواقف قد لا تكون مريحة', en: 'Situations that may feel uncomfortable' },
                         starter: { ar: 'ذكّر طفلك بقاعدة الأمان: لا أحد يلمس مناطقه الخاصة، ويمكنه دائماً إخبارك بأي شيء دون خوف.', en: 'Remind your child of the safety rule: no one touches their private parts, and they can always tell you anything without fear.' } }
        },
        // Keyword lists for lightweight, local theme tagging
        keywords: {
            fear:      { ar: ['خوف', 'خايف', 'خائف', 'مرعوب', 'رعب', 'فزع', 'كابوس', 'وحش'], en: ['scare', 'afraid', 'fear', 'fright', 'nightmare', 'monster', 'terrified'] },
            sadness:   { ar: ['حزين', 'زعلان', 'بكاء', 'بكيت', 'دموع', 'زعل', 'مكتئب'], en: ['sad', 'cry', 'unhappy', 'upset', 'tears', 'miss'] },
            isolation: { ar: ['وحيد', 'لحالي', 'وحدي', 'ما في حدا', 'معزول', 'ما حدا'], en: ['alone', 'lonely', 'nobody', 'no one', 'by myself', 'left out'] },
            anger:     { ar: ['غاضب', 'عصبت', 'كره', 'أكره', 'زعلان كتير'], en: ['angry', 'mad', 'hate', 'furious', 'annoyed'] },
            unsafe:    { ar: ['خطر', 'مو آمن', 'غير آمن', 'ضرب', 'آذاني', 'وجعني', 'وجع', 'سر', 'ما تحكي', 'لمس'], en: ['unsafe', 'danger', 'hurt', 'hit', 'secret', 'bad touch', 'pain'] },
            positive:  { ar: ['سعيد', 'فرحان', 'أمان', 'آمن', 'حب', 'لعب', 'مبسوط', 'فرح'], en: ['happy', 'safe', 'love', 'play', 'fun', 'joy', 'good', 'nice'] }
        },
        saveName: { ar: 'رسمتي', en: 'my-drawing' },
        aiThinking: { ar: '...', en: '...' }
    };

    // ---- State ----
    let activity = 'free';
    let currentFeeling = null;
    let questionIndex = 0;
    let convo = []; // {role:'bot'|'child', text}

    // ================= CANVAS =================
    const canvas = document.getElementById('drawCanvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let color = '#e53e3e';
    let brush = 8;
    let erasing = false;
    let undoStack = [];

    const COLORS = ['#e53e3e', '#f6ad55', '#ecc94b', '#48bb78', '#4FB7B3', '#4299e1', '#9f7aea', '#ed64a6', '#2d3748', '#a0522d'];

    function buildPalette() {
        const pal = document.getElementById('colorPalette');
        pal.innerHTML = '';
        COLORS.forEach((c, i) => {
            const sw = document.createElement('button');
            sw.className = 'color-swatch' + (i === 0 ? ' active' : '');
            sw.style.background = c;
            sw.setAttribute('aria-label', c);
            sw.addEventListener('click', () => {
                color = c;
                erasing = false;
                document.getElementById('eraserBtn').classList.remove('active');
                pal.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                sw.classList.add('active');
            });
            pal.appendChild(sw);
        });
    }

    function fitCanvas() {
        const wrap = canvas.parentElement;
        const ratio = window.devicePixelRatio || 1;
        const cssW = wrap.clientWidth;
        const cssH = canvas.clientHeight || 420;
        // preserve current image
        const prev = canvas.width ? canvas.toDataURL() : null;
        canvas.width = Math.round(cssW * ratio);
        canvas.height = Math.round(cssH * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (prev) {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0, cssW, cssH);
            img.src = prev;
        }
    }

    function pointerPos(e) {
        const rect = canvas.getBoundingClientRect();
        const p = e.touches ? e.touches[0] : e;
        return { x: p.clientX - rect.left, y: p.clientY - rect.top };
    }

    function snapshot() {
        try {
            undoStack.push(canvas.toDataURL());
            if (undoStack.length > 25) undoStack.shift();
        } catch (err) { /* ignore */ }
    }

    function startDraw(e) {
        e.preventDefault();
        drawing = true;
        snapshot();
        const { x, y } = pointerPos(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    function moveDraw(e) {
        if (!drawing) return;
        e.preventDefault();
        const { x, y } = pointerPos(e);
        ctx.strokeStyle = erasing ? '#ffffff' : color;
        ctx.lineWidth = erasing ? brush * 2.2 : brush;
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    function endDraw() { drawing = false; }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', moveDraw);
    window.addEventListener('mouseup', endDraw);
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', moveDraw, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    document.getElementById('brushSize').addEventListener('input', function () { brush = +this.value; });

    document.getElementById('eraserBtn').addEventListener('click', function () {
        erasing = !erasing;
        this.classList.toggle('active', erasing);
    });

    document.getElementById('undoBtn').addEventListener('click', function () {
        if (!undoStack.length) return;
        const data = undoStack.pop();
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.clientWidth, canvas.clientHeight);
        };
        img.src = data;
    });

    document.getElementById('clearBtn').addEventListener('click', function () {
        snapshot();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    document.getElementById('saveBtn').addEventListener('click', function () {
        const a = document.createElement('a');
        a.download = t(DR.saveName) + '-' + new Date().toISOString().split('T')[0] + '.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
    });

    // ================= ACTIVITIES =================
    function setActivity(id) {
        activity = id;
        document.querySelectorAll('.activity-card').forEach(c =>
            c.classList.toggle('active', c.getAttribute('data-activity') === id));
        renderPrompt();
    }
    function renderPrompt() {
        document.getElementById('promptBanner').textContent = t(DR.prompts[activity] || DR.prompts.free);
    }
    document.querySelectorAll('.activity-card').forEach(card => {
        card.addEventListener('click', () => setActivity(card.getAttribute('data-activity')));
    });

    // ================= FEELINGS =================
    function buildFeelings() {
        const wrap = document.getElementById('feelingButtons');
        wrap.innerHTML = '';
        DR.feelings.forEach(f => {
            const b = document.createElement('button');
            b.className = 'feeling-btn' + (currentFeeling === f.id ? ' active' : '');
            b.setAttribute('data-feeling', f.id);
            b.innerHTML = `<span class="fb-emoji">${f.emoji}</span><span class="fb-label">${t(f.label)}</span>`;
            b.addEventListener('click', () => {
                currentFeeling = f.id;
                buildFeelings();
                recordTheme(f.theme);
            });
            wrap.appendChild(b);
        });
    }

    // ================= THEME TRACKING (local, gentle) =================
    function loadThemes() {
        try { return JSON.parse(localStorage.getItem('drawThemeCounts') || '{}'); }
        catch (e) { return {}; }
    }
    function saveThemes(obj) {
        try { localStorage.setItem('drawThemeCounts', JSON.stringify(obj)); } catch (e) {}
    }
    function recordTheme(theme) {
        if (!theme) return;
        const counts = loadThemes();
        counts[theme] = (counts[theme] || 0) + 1;
        saveThemes(counts);
    }
    // Scan a child's message for theme keywords in BOTH languages
    function tagMessage(text) {
        const low = (' ' + text + ' ').toLowerCase();
        Object.keys(DR.keywords).forEach(theme => {
            const lists = DR.keywords[theme];
            const hit = ['ar', 'en'].some(l => lists[l].some(k => low.indexOf(k.toLowerCase()) !== -1));
            if (hit) recordTheme(theme);
        });
    }

    // ================= TALK PANEL =================
    function addBubble(text, role) {
        const box = document.getElementById('talkMessages');
        const div = document.createElement('div');
        div.className = 'talk-msg ' + role;
        div.textContent = text;
        box.appendChild(div);
        box.scrollTop = box.scrollHeight;
        return div;
    }

    function openTalk() {
        document.getElementById('talkPanel').style.display = 'flex';
        if (convo.length === 0) {
            const intro = t(DR.botIntro);
            addBubble(intro, 'bot');
            convo.push({ role: 'bot', text: intro });
            const q = t(DR.firstQuestion[activity] || DR.firstQuestion.free);
            addBubble(q, 'bot');
            convo.push({ role: 'bot', text: q });
        }
        document.getElementById('talkPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.getElementById('talkInput').focus();
    }

    async function childSend() {
        const input = document.getElementById('talkInput');
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        addBubble(text, 'child');
        convo.push({ role: 'child', text: text });
        tagMessage(text);

        // Gentle affirmation, then a follow-up question (AI if available, else scripted)
        const thinking = addBubble(t(DR.aiThinking), 'bot');
        let question = await askGentleAI();
        if (!question) {
            const acks = DR.acks[drLang()];
            const ack = acks[Math.floor(Math.random() * acks.length)];
            const bank = DR.followUps[drLang()];
            question = ack + ' ' + bank[questionIndex % bank.length];
            questionIndex++;
        }
        thinking.textContent = question;
        convo.push({ role: 'bot', text: question });
        document.getElementById('talkMessages').scrollTop = 1e9;
    }

    // Safe AI: returns ONE gentle open-ended question in the current language,
    // or null if the AI is unavailable (caller falls back to the scripted bank).
    async function askGentleAI() {
        const key = window.GEMINI_API_KEY;
        const model = window.GEMINI_MODEL || 'gemini-2.0-flash';
        if (!key || key.indexOf('PASTE_YOUR') === 0) return null;

        const lang = drLang() === 'en' ? 'English' : 'Arabic';
        const transcript = convo.map(m => (m.role === 'bot' ? 'You' : 'Child') + ': ' + m.text).join('\n');
        const system =
`You are a warm, gentle friend talking with a CHILD aged 4-12 who just made a drawing (activity: ${activity}).
Your ONLY job is to help the child describe their drawing and feelings.
STRICT RULES:
- Reply ONLY in ${lang}.
- Ask exactly ONE short, simple, open-ended question (max 12 words).
- Be warm, playful and encouraging. Use very simple words a young child understands.
- NEVER diagnose, NEVER conclude anything, NEVER mention abuse, danger or scary words.
- Do NOT give advice or long explanations. Only a caring question.
- Do NOT repeat a question already asked.
Conversation so far:
${transcript}

Your next gentle question:`;

        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: system }] }],
                        generationConfig: { temperature: 0.8, maxOutputTokens: 60 }
                    })
                }
            );
            if (!res.ok) {
                console.warn('Drawing AI unavailable', res.status, await res.text());
                return null;
            }
            const data = await res.json();
            const out = data && data.candidates && data.candidates[0] &&
                data.candidates[0].content && data.candidates[0].content.parts[0].text;
            return out ? out.trim().replace(/^["']|["']$/g, '') : null;
        } catch (err) {
            console.warn('Drawing AI error', err);
            return null;
        }
    }

    document.getElementById('doneBtn').addEventListener('click', openTalk);
    document.getElementById('talkSend').addEventListener('click', childSend);
    document.getElementById('talkInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') childSend();
    });

    document.getElementById('resetBtn').addEventListener('click', function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        undoStack = [];
        convo = [];
        currentFeeling = null;
        questionIndex = 0;
        document.getElementById('talkMessages').innerHTML = '';
        document.getElementById('talkPanel').style.display = 'none';
        buildFeelings();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ================= PARENTS' CORNER =================
    function renderParents() {
        const counts = loadThemes();
        const entries = Object.keys(counts)
            .filter(k => DR.themes[k])
            .sort((a, b) => counts[b] - counts[a]);

        const patternsBox = document.getElementById('parentsPatterns');
        const startersBox = document.getElementById('parentsStarters');
        patternsBox.innerHTML = '';
        startersBox.innerHTML = '';

        if (entries.length === 0) {
            const none = window.siteTranslations && window.siteTranslations.dr_parents_none;
            patternsBox.innerHTML = '<p style="color:#718096">' + (none ? t(none) : '') + '</p>';
            return;
        }

        entries.forEach(k => {
            const th = DR.themes[k];
            const item = document.createElement('div');
            item.className = 'pattern-item';
            item.innerHTML =
                `<span class="pattern-emoji">${th.emoji}</span>` +
                `<span class="pattern-text">${t(th.label)}</span>` +
                `<span class="pattern-count">${counts[k]}</span>`;
            patternsBox.appendChild(item);

            const li = document.createElement('li');
            li.textContent = t(th.starter);
            startersBox.appendChild(li);
        });
    }

    function openParents() {
        renderParents();
        document.getElementById('parentsModal').style.display = 'flex';
    }
    function closeParents() {
        document.getElementById('parentsModal').style.display = 'none';
    }
    document.getElementById('parentsToggle').addEventListener('click', openParents);
    document.getElementById('parentsClose').addEventListener('click', closeParents);
    document.getElementById('parentsOverlay').addEventListener('click', closeParents);

    // ================= LANGUAGE CHANGE =================
    // Re-render everything that JS generated so it matches the new language.
    document.addEventListener('sitelangchange', function () {
        renderPrompt();
        buildFeelings();
        // Refresh the intro/first question ONLY if the conversation hasn't really started
        if (convo.filter(m => m.role === 'child').length === 0 &&
            document.getElementById('talkPanel').style.display !== 'none') {
            document.getElementById('talkMessages').innerHTML = '';
            convo = [];
            openTalk();
        }
        if (document.getElementById('parentsModal').style.display === 'flex') renderParents();
    });

    // ================= INIT =================
    buildPalette();
    buildFeelings();
    renderPrompt();
    fitCanvas();
    window.addEventListener('resize', fitCanvas);

    // Scroll-to-top button (matches the other pages)
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function () {
            scrollTopBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
        });
        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
})();
