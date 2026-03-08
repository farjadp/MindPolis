import { ImageResponse } from 'next/og'
import { db } from "@/lib/db"

export const runtime = 'edge'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const hash = searchParams.get('hash')

        if (!hash) {
            return new Response('Hash required', { status: 400 })
        }

        const result = await db.assessmentResult.findUnique({
            where: { shareHash: hash },
            select: { archetype: true, topDimensions: true }
        })

        if (!result) {
            return new Response('Not found', { status: 404 })
        }

        const archetype = result.archetype || "Unknown"

        let topDimLabel = ""
        let topDimValue = ""
        try {
            if (result.topDimensions && Array.isArray(result.topDimensions)) {
                topDimLabel = (result.topDimensions as any[])[0].key
                topDimValue = Math.round((result.topDimensions as any[])[0].value) + "%"
            }
        } catch (e) { }

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#111111',
                        color: '#FDFCF8',
                        fontFamily: 'serif',
                        padding: '40px',
                    }}
                >
                    {/* Left Side: Generative Shape (Simulated) */}
                    <div style={{ display: 'flex', width: '40%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ width: '300px', height: '300px', border: '2px solid #333', borderRadius: '50%', position: 'absolute' }} />
                        <div style={{ width: '200px', height: '200px', border: '2px solid #FDFCF8', transform: 'rotate(45deg)', position: 'absolute' }} />
                        <div style={{ width: '200px', height: '200px', border: '2px solid #555', transform: 'rotate(15deg)', position: 'absolute' }} />
                    </div>

                    {/* Right Side: Data */}
                    <div style={{ display: 'flex', flexDirection: 'column', width: '60%', height: '100%', justifyContent: 'center', paddingLeft: '60px' }}>
                        <div style={{ fontSize: 24, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: 20 }}>
                            VERIFIED COGNITIVE PROFILE
                        </div>

                        <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1, marginBottom: 40 }}>
                            {archetype}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: 32, color: '#4B9FFF', marginBottom: 10 }}>
                                Dominant Trait: {topDimLabel}
                            </div>
                            <div style={{ fontSize: 48, fontWeight: 'bold' }}>
                                {topDimValue}
                            </div>
                        </div>

                        <div style={{ display: 'flex', position: 'absolute', bottom: 40, right: 40, fontSize: 24, letterSpacing: '0.1em', color: '#666' }}>
                            mindpolis.com/r/{hash.split('-')[0]}
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        )
    } catch (e: any) {
        console.error(e)
        return new Response(`Failed to generate the image`, {
            status: 500,
        })
    }
}
