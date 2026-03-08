import { PrismaClient, QuestionType } from '@prisma/client'

const prisma = new PrismaClient()

const questions = [
    // Economic Axis
    { id: 'E1', text: 'Governments should redistribute wealth through heavy taxation of the rich.', axis: 'Economic', direction: 'Left' },
    { id: 'E2', text: 'The freer the market, the freer the people.', axis: 'Economic', direction: 'Right' },
    { id: 'E3', text: 'Public ownership of major industries is preferable to private ownership.', axis: 'Economic', direction: 'Left' },
    { id: 'E4', text: 'Corporations should be free from most government regulation.', axis: 'Economic', direction: 'Right' },
    { id: 'E5', text: 'Welfare benefits should be expanded even if it requires higher taxes.', axis: 'Economic', direction: 'Left' },
    { id: 'E6', text: 'Competition between companies usually leads to better outcomes for society.', axis: 'Economic', direction: 'Right' },
    { id: 'E7', text: 'Essential services like healthcare should always be publicly funded.', axis: 'Economic', direction: 'Left' },
    { id: 'E8', text: 'Large corporations are generally too powerful and should be broken up.', axis: 'Economic', direction: 'Left' },
    { id: 'E9', text: 'Economic inequality is a natural outcome of freedom and should not be heavily restricted.', axis: 'Economic', direction: 'Right' },
    { id: 'E10', text: 'Workers should have strong legal protections against employers.', axis: 'Economic', direction: 'Left' },
    { id: 'E11', text: 'Free trade agreements generally benefit society.', axis: 'Economic', direction: 'Right' },
    { id: 'E12', text: 'Governments should protect local industries even if it harms global trade.', axis: 'Economic', direction: 'Left' },
    { id: 'E13', text: 'Privatization usually improves efficiency of public services.', axis: 'Economic', direction: 'Right' },
    { id: 'E14', text: 'Housing should be considered a basic right guaranteed by the state.', axis: 'Economic', direction: 'Left' },
    { id: 'E15', text: 'The government should not interfere in how businesses set wages.', axis: 'Economic', direction: 'Right' },
    { id: 'E16', text: 'Wealth concentration is dangerous for democracy.', axis: 'Economic', direction: 'Left' },
    { id: 'E17', text: 'Taxation beyond basic state needs is unjustified.', axis: 'Economic', direction: 'Right' },
    { id: 'E18', text: 'Public transportation should be heavily subsidized.', axis: 'Economic', direction: 'Left' },
    { id: 'E19', text: 'Entrepreneurship should face minimal regulatory barriers.', axis: 'Economic', direction: 'Right' },
    { id: 'E20', text: 'The state should intervene to reduce economic inequality.', axis: 'Economic', direction: 'Left' },

    // Authority / Liberty Axis
    { id: 'S1', text: 'Governments should have the power to monitor citizens for security purposes.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S2', text: 'Freedom of speech should be protected even for offensive opinions.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S3', text: 'National security sometimes requires sacrificing personal privacy.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S4', text: 'People should be free to live however they choose without government interference.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S5', text: 'Strict laws and punishment are necessary to maintain social order.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S6', text: 'Drug use should be decriminalized.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S7', text: 'Governments should have the authority to censor harmful information online.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S8', text: 'Conscription (mandatory military service) can be justified.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S9', text: 'Individuals should have full control over their own bodies.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S10', text: 'Police powers should be expanded to combat crime effectively.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S11', text: 'Surveillance cameras in public spaces are acceptable if they increase safety.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S12', text: 'Protest and civil disobedience are legitimate tools of political expression.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S13', text: 'Immigration should be tightly controlled to preserve social stability.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S14', text: 'Cultural diversity strengthens society.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S15', text: 'The state should enforce traditional moral values.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S16', text: 'Government should not interfere in personal relationships between consenting adults.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S17', text: 'Emergency powers for government are necessary in times of crisis.', axis: 'Authority', direction: 'Authoritarian' },
    { id: 'S18', text: 'Citizens should have strong legal protections against state surveillance.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S19', text: 'Religious beliefs should never influence government lawmaking.', axis: 'Authority', direction: 'Libertarian' },
    { id: 'S20', text: 'Maintaining order is more important than protecting individual freedom.', axis: 'Authority', direction: 'Authoritarian' },
]

async function main() {
    console.log('Seeding Standard 40-Question Political Compass...')

    // Upsert the instrument
    const assessment = await prisma.assessment.upsert({
        where: { slug: 'political-compass-standard' },
        update: {},
        create: {
            slug: 'political-compass-standard',
            title: 'Political Compass (Standard)',
            description: 'The definitive 40-question political ideology assessment mapping you on Economic and Social/Authority axes.',
            estimatedMinutes: 8,
            isActive: true,
            isResearch: false,
        },
    })

    console.log('Assessment created:', assessment.title)

    // Upsert Scoring Dimensions
    const dimensions = [
        { key: 'Economic', label: 'Economic Axis', minLabel: 'Left', maxLabel: 'Right' },
        { key: 'Authority', label: 'Authority / Liberty', minLabel: 'Libertarian', maxLabel: 'Authoritarian' }
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
        { id: 'sa', text: 'Strongly Agree', scores: { base: 2 } },
        { id: 'a', text: 'Agree', scores: { base: 1 } },
        { id: 'd', text: 'Disagree', scores: { base: -1 } },
        { id: 'sd', text: 'Strongly Disagree', scores: { base: -2 } }
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
                isReversed: q.direction === 'Left' || q.direction === 'Libertarian', // Used to flip score mapping easily if needed
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

    console.log('Added 40 questions.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
