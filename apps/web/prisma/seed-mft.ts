import { PrismaClient, QuestionType } from '@prisma/client'

const prisma = new PrismaClient()

const questions = [
    // Care / Harm
    { id: 'C1', text: 'Compassion for those who are suffering is one of the most important virtues.', axis: 'Care' },
    { id: 'C2', text: 'It is morally wrong to harm others even if it leads to a greater benefit.', axis: 'Care' },
    { id: 'C3', text: 'Governments should prioritize protecting vulnerable groups.', axis: 'Care' },
    { id: 'C4', text: 'Seeing someone suffer makes me want to help them.', axis: 'Care' },
    { id: 'C5', text: 'Causing emotional pain can be just as wrong as causing physical harm.', axis: 'Care' },
    { id: 'C6', text: 'Society should reduce suffering even if it requires sacrificing efficiency.', axis: 'Care' },

    // Fairness / Cheating
    { id: 'F1', text: 'Justice means treating everyone according to the same rules.', axis: 'Fairness' },
    { id: 'F2', text: 'People who cheat the system deserve strong punishment.', axis: 'Fairness' },
    { id: 'F3', text: 'Economic systems should ensure fairness for everyone.', axis: 'Fairness' },
    { id: 'F4', text: 'It bothers me when people take advantage of others.', axis: 'Fairness' },
    { id: 'F5', text: 'Equal opportunity is more important than equal outcomes.', axis: 'Fairness' },
    { id: 'F6', text: 'It is unfair when some groups gain benefits others cannot access.', axis: 'Fairness' },

    // Loyalty / Betrayal
    { id: 'L1', text: 'Loyalty to one’s nation is an important virtue.', axis: 'Loyalty' },
    { id: 'L2', text: 'People should stand by their community even when it makes mistakes.', axis: 'Loyalty' },
    { id: 'L3', text: 'Betraying one’s group is morally wrong.', axis: 'Loyalty' },
    { id: 'L4', text: 'Supporting one’s country in international conflicts is important.', axis: 'Loyalty' },
    { id: 'L5', text: 'Shared identity strengthens social cohesion.', axis: 'Loyalty' },
    { id: 'L6', text: 'Protecting national interests should come before global concerns.', axis: 'Loyalty' },

    // Authority / Subversion
    { id: 'A1', text: 'Respect for authority is necessary for a stable society.', axis: 'Authority' },
    { id: 'A2', text: 'Children should be taught to respect authority figures.', axis: 'Authority' },
    { id: 'A3', text: 'Social order depends on strong institutions.', axis: 'Authority' },
    { id: 'A4', text: 'Disobeying legitimate authority undermines society.', axis: 'Authority' },
    { id: 'A5', text: 'Traditions deserve respect because they maintain stability.', axis: 'Authority' },
    { id: 'A6', text: 'Hierarchies often serve a necessary social function.', axis: 'Authority' },

    // Sanctity / Purity
    { id: 'S1', text: 'Some actions are morally wrong because they are degrading.', axis: 'Sanctity' },
    { id: 'S2', text: 'Maintaining moral purity is important for society.', axis: 'Sanctity' },
    { id: 'S3', text: 'Certain traditions should be preserved because they protect moral values.', axis: 'Sanctity' },
    { id: 'S4', text: 'Disgust can be an important guide to moral judgment.', axis: 'Sanctity' },
    { id: 'S5', text: 'People should avoid behaviors that corrupt moral character.', axis: 'Sanctity' },
    { id: 'S6', text: 'Respect for sacred values helps hold societies together.', axis: 'Sanctity' },

    // Liberty / Oppression
    { id: 'LB1', text: 'Individuals should be free from excessive government control.', axis: 'Liberty' },
    { id: 'LB2', text: 'Concentrated power is dangerous for freedom.', axis: 'Liberty' },
    { id: 'LB3', text: 'Citizens should resist oppressive authority.', axis: 'Liberty' },
    { id: 'LB4', text: 'Personal freedom should be protected even if it creates social risk.', axis: 'Liberty' },
    { id: 'LB5', text: 'Governments should not control people’s personal choices.', axis: 'Liberty' },
    { id: 'LB6', text: 'Freedom from domination is a fundamental moral value.', axis: 'Liberty' },
]

async function main() {
    console.log('Seeding Moral Foundations Questionnaire (MFQ-36)...')

    // Upsert the instrument
    const assessment = await prisma.assessment.upsert({
        where: { slug: 'moral-foundations-36' },
        update: {},
        create: {
            slug: 'moral-foundations-36',
            title: 'Moral Foundations (MFQ-36)',
            description: 'The Moral Foundations Questionnaire evaluates your cognitive sensitivity across six evolutionary moral dimensions.',
            estimatedMinutes: 6,
            isActive: true,
            isResearch: true,
        },
    })

    console.log('Assessment created:', assessment.title)

    // Upsert Scoring Dimensions
    const dimensions = [
        { key: 'Care', label: 'Care / Harm', minLabel: 'Unconcerned', maxLabel: 'Compassionate' },
        { key: 'Fairness', label: 'Fairness / Cheating', minLabel: 'Indifferent', maxLabel: 'Justice-focused' },
        { key: 'Loyalty', label: 'Loyalty / Betrayal', minLabel: 'Individualist', maxLabel: 'Loyalist' },
        { key: 'Authority', label: 'Authority / Subversion', minLabel: 'Subversive', maxLabel: 'Compliant' },
        { key: 'Sanctity', label: 'Sanctity / Degradation', minLabel: 'Secular', maxLabel: 'Sacred' },
        { key: 'Liberty', label: 'Liberty / Oppression', minLabel: 'Accepts Authority', maxLabel: 'Freedom-focused' }
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
                isReversed: false, // MFQ questions provided are uniformly mapped
                isActive: true,
                metadata: {
                    qid: q.id,
                    axis: q.axis,
                }
            }
        })
    }

    console.log('Added 36 questions.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
