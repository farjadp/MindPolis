import { PrismaClient, QuestionType } from '@prisma/client'

const prisma = new PrismaClient()

const questions = [
    // Economic Axis
    { id: 'E1', text: 'دولت‌ها باید از طریق وضع مالیات‌های سنگین بر ثروتمندان، ثروت را بازتوزیع کنند.', axis: 'Economic', direction: 'Left' },
    { id: 'E2', text: 'هرچه بازار آزادتر باشد، مردم آزادتر خواهند بود.', axis: 'Economic', direction: 'Right' },
    { id: 'E3', text: 'مالکیت عمومی در صنایع بزرگ و کلیدی بر مالکیت خصوصی ارجحیت دارد.', axis: 'Economic', direction: 'Left' },
    { id: 'E4', text: 'شرکت‌های بزرگ باید از بیشتر مقررات دولتی معاف و آزاد باشند.', axis: 'Economic', direction: 'Right' },
    { id: 'E5', text: 'تامین اجتماعی باید گسترش یابد، حتی اگر نیازمند اخذ مالیات‌های بیشتر باشد.', axis: 'Economic', direction: 'Left' },
    { id: 'E6', text: 'رقابت بین شرکت‌ها معمولاً به نتایج بهتری برای کل جامعه منجر می‌شود.', axis: 'Economic', direction: 'Right' },
    { id: 'E7', text: 'خدمات اساسی نظیر بهداشت و درمان باید همواره توسط بودجه‌های دولتی تامین شوند.', axis: 'Economic', direction: 'Left' },
    { id: 'E8', text: 'شرکت‌های کلان عموماً بیش از حد قدرتمند هستند و باید کوچک شوند.', axis: 'Economic', direction: 'Left' },
    { id: 'E9', text: 'نابرابری اقتصادی پیامد طبیعی آزادی است و نباید به شدت محدود گردد.', axis: 'Economic', direction: 'Right' },
    { id: 'E10', text: 'کارگران باید از حمایت‌های قانونی قدرتمندی در برابر کارفرمایان برخوردار باشند.', axis: 'Economic', direction: 'Left' },
    { id: 'E11', text: 'توافق‌نامه‌های تجارت آزاد در مجموع به نفع جوامع هستند.', axis: 'Economic', direction: 'Right' },
    { id: 'E12', text: 'دولت‌ها موظف‌اند از صنایع داخلی محافظت کنند، حتی اگر به تجارت جهانی آسیب برساند.', axis: 'Economic', direction: 'Left' },
    { id: 'E13', text: 'خصوصی‌سازی عموماً کارایی خدمات عمومی را افزایش می‌دهد.', axis: 'Economic', direction: 'Right' },
    { id: 'E14', text: 'مسکن باید یک حق اساسی شناخته شده و توسط دولت تضمین گردد.', axis: 'Economic', direction: 'Left' },
    { id: 'E15', text: 'دولت نباید در نحوه تعیین دستمزدها توسط کسب‌وکارها مداخله کند.', axis: 'Economic', direction: 'Right' },
    { id: 'E16', text: 'تمرکز ثروت برای بقای دموکراسی خطرناک است.', axis: 'Economic', direction: 'Left' },
    { id: 'E17', text: 'اخذ مالیاتی فراتر از نیازهای اساسی دولت، غیرقابل توجیه است.', axis: 'Economic', direction: 'Right' },
    { id: 'E18', text: 'حمل‌ونقل عمومی باید به شدت یارانه‌ای و تحت حمایت مالی دولت باشد.', axis: 'Economic', direction: 'Left' },
    { id: 'E19', text: 'کارآفرینی باید با کمترین موانع نظارتی روبرو شود.', axis: 'Economic', direction: 'Right' },
    { id: 'E20', text: 'حکومت باید برای کاهش نابرابری اقتصادی مداخله مستقیم کند.', axis: 'Economic', direction: 'Left' },

    // Authority / Liberty Axis
    { id: 'S1', text: 'دولت‌ها باید از این اختیار برخوردار باشند که برای مقاصد امنیتی، شهروندان را تحت نظر قرار دهند.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S2', text: 'آزادی بیان باید محافظت شود، حتی در مورد عقایدی که توهین‌آمیز هستند.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S3', text: 'امنیت ملی گاهی اوقات ایجاب می‌کند که حریم خصوصی افراد فدا شود.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S4', text: 'افراد باید آزاد باشند فارغ از مداخله دولت، هرطور که مایلند زندگی کنند.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S5', text: 'قوانین و مجازات‌های سخت‌گیرانه برای حفظ نظم اجتماعی کاملاً ضروری است.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S6', text: 'مصرف تمامی مواد مخدر تفریحی باید از دایره جرایم کیفری خارج شود.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S7', text: 'دولت‌ها باید اقتدار آن را داشته باشند که اطلاعات مضر و مخرب را در اینترنت مسدود کنند.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S8', text: 'خدمت وظیفه عمومی (سربازی اجباری) از نظر منطقی مساله‌ای موجه است.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S9', text: 'افراد باید کنترل کامل و مطلقی بر انتخاب‌های بیولوژیک بدن خود داشته باشند.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S10', text: 'اختیارات پلیس باید برای مبارزه موثرتر با جرم و جنایت توسعه یابد.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S11', text: 'نصب دوربین‌های نظارتی در اماکن عمومی در صورتی که باعث ایجاد امنیت شوند قابل‌قبول است.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S12', text: 'اعتراض و نافرمانی مدنی ابزارهای کاملاً مشروعی برای بیان سیاسی محسوب می‌شوند.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S13', text: 'مهاجرت باید به منظور حفظ ثبات اجتماعی به‌شدت کنترل و محدود شود.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S14', text: 'تنوع و تکثر فرهنگی عاملی است که همواره موجب قدرتمندتر شدن یک جامعه می‌گردد.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S15', text: 'حکومت وظیفه دارد ارزش‌های اخلاقی و سنتی را در جامعه اِعمال و قانون‌گذاری کند.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S16', text: 'دولت هرگز نباید در روابط شخصی میان بزرگسالانِ دارای رضایت دخالت کند.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S17', text: 'اعطای اختیارات فراقانونی و ویژه به دولت در زمان‌های بحران امری کاملا منطقی است.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S18', text: 'شهروندان باید در برابر شنود و نظارت‌های دولتی دارای امنیت و حمایت‌های قانونی باشند.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S19', text: 'باورهای مذهبی هرگز نباید در قانون‌گذاری و تصمیمات دولت رسوخ داشته باشند.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S20', text: 'حفظ و پایداری نظم اجتماعی، بسیار مهم‌تر از محافظت بی‌قید‌وشرط از آزادی‌های فردی است.', axis: 'Authority', direction: 'Authoritarian' },
]

async function main() {
    console.log('Seeding Farsi Standard 40-Question Political Compass...')

    const assessment = await prisma.assessment.upsert({
        where: { slug: 'political-compass-standard-fa' },
        update: {},
        create: {
            slug: 'political-compass-standard-fa',
            title: 'قطب‌نمای سیاسی استاندارد',
            description: 'ارزیابی جامع و معتبر ایدئولوژیک شامل ۴۰ دوراهی برای تعیین جایگاه شما در محورهای اقتصاد و آزادی.',
            estimatedMinutes: 8,
            isActive: true,
            isResearch: false,
        },
    })

    console.log('Assessment created:', assessment.title)

    // Upsert Scoring Dimensions
    const dimensions = [
        { key: 'Economic', label: 'محور اقتصاد', minLabel: 'چپ', maxLabel: 'راست' },
        { key: 'Authority', label: 'اختیار / اقتدار', minLabel: 'آزادی‌خواه', maxLabel: 'اقتدارگرا' }
    ]

    for (const dim of dimensions) {
        await prisma.scoringDimension.upsert({
            where: {
                assessmentId_key: {
                    assessmentId: assessment.id,
                    key: dim.key
                }
            },
            update: {
                label: dim.label,
                minLabel: dim.minLabel,
                maxLabel: dim.maxLabel,
                weight: 1.0
            },
            create: {
                assessmentId: assessment.id,
                key: dim.key,
                label: dim.label,
                minLabel: dim.minLabel,
                maxLabel: dim.maxLabel,
                weight: 1.0
            }
        })
    }

    // Standard options for all questions
    const baseOptions = [
        { id: 'sa', text: 'کاملا موافقم', scores: { base: 2 } },
        { id: 'a', text: 'موافقم', scores: { base: 1 } },
        { id: 'd', text: 'مخالفم', scores: { base: -1 } },
        { id: 'sd', text: 'کاملا مخالفم', scores: { base: -2 } }
    ]

    // Delete existing questions
    await prisma.question.deleteMany({
        where: { assessmentId: assessment.id }
    })

    // Create questions
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i]

        await prisma.question.create({
            data: {
                assessmentId: assessment.id,
                order: i + 1,
                text: q.text,
                type: QuestionType.LIKERT_5,
                dimensionKeys: [q.axis],
                isReversed: q.direction === 'Left' || q.direction === 'Libertarian',
                isActive: true,
                metadata: {
                    qid: q.id,
                    axis: q.axis,
                    direction: q.direction,
                    options: baseOptions
                }
            }
        })
    }

    console.log('Added 40 Farsi questions.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
