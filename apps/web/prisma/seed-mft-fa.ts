import { PrismaClient, QuestionType } from '@prisma/client'

const prisma = new PrismaClient()

const questions = [
    // Care / Harm
    { id: 'C1', text: 'شفقت و دلسوزی نسبت به کسانی که در رنج هستند، یکی از مهم‌ترین فضایل اخلاقی است.', axis: 'Care' },
    { id: 'C2', text: 'آسیب رساندن به دیگران از نظر اخلاقی اشتباه است، حتی اگر در نهایت منجر به منفعتی بزرگ‌تر شود.', axis: 'Care' },
    { id: 'C3', text: 'دولت‌ها باید محافظت از گروه‌های آسیب‌پذیر جامعه را در اولویت قرار دهند.', axis: 'Care' },
    { id: 'C4', text: 'دیدن رنج یک انسان باعث می‌شود بخواهم به او کمک کنم.', axis: 'Care' },
    { id: 'C5', text: 'ایجاد درد عاطفی می‌تواند به اندازه ایجاد آسیب فیزیکی کار اشتباهی باشد.', axis: 'Care' },
    { id: 'C6', text: 'جامعه باید برای کاهش رنج تلاش کند، حتی اگر نیازمند فدا کردن مقداری از کارایی و رشد باشد.', axis: 'Care' },

    // Fairness / Cheating
    { id: 'F1', text: 'عدالت به معنای رفتار یکسان و اعمال قوانین برابر برای همه افراد است.', axis: 'Fairness' },
    { id: 'F2', text: 'افرادی که سیستم را دور می‌زنند و تقلب می‌کنند مستحق مجازات شدیدی هستند.', axis: 'Fairness' },
    { id: 'F3', text: 'سیستم‌های اقتصادی باید متضمن انصاف و عدالت برای همه باشند.', axis: 'Fairness' },
    { id: 'F4', text: 'شنیدن اینکه کسی از دیگران سواستفاده می‌کند باعث آزار و ناراحتی من می‌شود.', axis: 'Fairness' },
    { id: 'F5', text: 'برابری فرصت‌ها از برابری نتایج هم مهم‌تر است.', axis: 'Fairness' },
    { id: 'F6', text: 'اینکه برخی گروه‌ها مزایایی دریافت کنند که دیگران از آن محرومند، غیرمنصفانه است.', axis: 'Fairness' },

    // Loyalty / Betrayal
    { id: 'L1', text: 'وفاداری به ملت و میهن خود، یک فضیلت بسیار مهم است.', axis: 'Loyalty' },
    { id: 'L2', text: 'افراد باید در کنار جامعه و گروه خود بایستند، حتی زمانی که جامعه مرتکب اشتباه می‌شود.', axis: 'Loyalty' },
    { id: 'L3', text: 'خیانت به گروه خود از نظر اخلاقی کاملا غیرقابل توجیه است.', axis: 'Loyalty' },
    { id: 'L4', text: 'حمایت از کشور خود در مناقشات بین‌المللی امری ضروری است.', axis: 'Loyalty' },
    { id: 'L5', text: 'داشتن یک هویت مشترک باعث تقویت مستحکم انسجام اجتماعی می‌شود.', axis: 'Loyalty' },
    { id: 'L6', text: 'محافظت از منافع ملی باید همواره بر دغدغه‌های جهانی مقدم باشد.', axis: 'Loyalty' },

    // Authority / Subversion
    { id: 'A1', text: 'احترام به اقتدار و مراجع قدرت برای داشتن جامعه‌ای باثبات ضروری است.', axis: 'Authority' },
    { id: 'A2', text: 'به کودکان باید آموزش داده شود که به مراجع قدرت و بزرگترها احترام بگذارند.', axis: 'Authority' },
    { id: 'A3', text: 'نظم اجتماعی وابستگی مستقیمی به وجود نهادهای قدرتمند دارد.', axis: 'Authority' },
    { id: 'A4', text: 'نافرمانی از قدرت مشروع، بنیان‌های جامعه را تضعیف می‌کند.', axis: 'Authority' },
    { id: 'A5', text: 'سنت‌ها شایسته احترام‌اند زیرا آن‌ها حافظ ثبات جامعه هستند.', axis: 'Authority' },
    { id: 'A6', text: 'سلسله‌مراتب اغلب کارکردی ضروری و حیاتی در جامعه ایفا می‌کند.', axis: 'Authority' },

    // Sanctity / Purity
    { id: 'S1', text: 'برخی کارها از نظر اخلاقی اشتباهند زیرا در نفس خود حقارت‌آمیز و کسر شأن هستند.', axis: 'Sanctity' },
    { id: 'S2', text: 'حفظ پاکی و طهارت اخلاقی برای جامعه بسیار مهم است.', axis: 'Sanctity' },
    { id: 'S3', text: 'برخی سنت‌ها باید حفظ شوند زیرا آن‌ها پاسدار ارزش‌های اخلاقی‌اند.', axis: 'Sanctity' },
    { id: 'S4', text: 'حس انزجار و چندش می‌تواند راهنمای مهمی برای قضاوت‌های اخلاقی باشد.', axis: 'Sanctity' },
    { id: 'S5', text: 'افراد باید از رفتارهایی که باعث فساد شخصیت و روان می‌شود دوری کنند.', axis: 'Sanctity' },
    { id: 'S6', text: 'احترام به ارزش‌های مقدس، جوامع را در کنار هم نگه می‌دارد.', axis: 'Sanctity' },

    // Liberty / Oppression
    { id: 'LB1', text: 'افراد باید از کنترل بیش‌از‌حد دولت‌ها در امان و آزاد باشند.', axis: 'Liberty' },
    { id: 'LB2', text: 'تمرکز قدرت، خطر بزرگی برای آزادی محسوب می‌شود.', axis: 'Liberty' },
    { id: 'LB3', text: 'شهروندان موظف‌اند در برابر مقامات و قدرت‌های سرکوب‌گر مقاومت کنند.', axis: 'Liberty' },
    { id: 'LB4', text: 'آزادی فردی باید محافظت شود، حتی اگر این امر موجب ایجاد ریسک‌های اجتماعی گردد.', axis: 'Liberty' },
    { id: 'LB5', text: 'دولت‌ها بهیچ‌وجه نباید انتخاب‌های شخصی مردم را تحت کنترل داشته باشند.', axis: 'Liberty' },
    { id: 'LB6', text: 'رهایی از سلطه و استبداد یک ارزش بنیادین انسانی و اخلاقی است.', axis: 'Liberty' },
]

async function main() {
    console.log('Seeding Farsi Moral Foundations Questionnaire (MFQ-36)...')

    const assessment = await prisma.assessment.upsert({
        where: { slug: 'moral-foundations-36-fa' },
        update: {},
        create: {
            slug: 'moral-foundations-36-fa',
            title: 'مبانی اخلاقی', // Moral Foundations
            description: 'پرسشنامه معتبر جهانی برای ارزیابی مبانی تکاملی و ریشه‌ای تصمیم‌گیری‌های اخلاقی شما در ۶ بعد اساسی.',
            estimatedMinutes: 6,
            isActive: true,
            isResearch: true,
        },
    })

    console.log('Assessment created:', assessment.title)

    // Upsert Scoring Dimensions
    const dimensions = [
        { key: 'Care', label: 'مراقبت / آسیب', minLabel: 'بی‌تفاوت', maxLabel: 'دلسوز' },
        { key: 'Fairness', label: 'انصاف / تقلب', minLabel: 'بی‌تفاوت', maxLabel: 'عدالت‌جو' },
        { key: 'Loyalty', label: 'وفاداری / خیانت', minLabel: 'فردگرا', maxLabel: 'وفادار' },
        { key: 'Authority', label: 'اقتدار / براندازی', minLabel: 'قانون‌شکن', maxLabel: 'فرمان‌بردار' },
        { key: 'Sanctity', label: 'تقدس / تنزل', minLabel: 'سکولار', maxLabel: 'ارزش‌مدار' },
        { key: 'Liberty', label: 'آزادی / ستم', minLabel: 'اقتدارطلب', maxLabel: 'آزادی‌خواه' }
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
                isReversed: false,
                isActive: true,
                metadata: {
                    qid: q.id,
                    axis: q.axis,
                }
            }
        })
    }

    console.log('Added 36 Farsi questions.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
