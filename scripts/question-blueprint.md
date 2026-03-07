# ============================================================================
# MindPolis: scripts/question-blueprint.md
# Version: 1.0.0 — 2026-03-07
# Why: Phase 1 blueprint — defines the structural skeleton for all 48 questions
#      before full content generation. Locks axis distribution, subtype,
#      complexity, academic basis, and cross-axis mapping.
#      This document is the contract that question-bank.json must satisfy.
# ============================================================================

## Methodology Note

- All items are theory-informed originals — no verbatim reproduction of WVS/ESS/MFQ items
- Academic grounding is preserved via construct mapping, not item copying
- Ideological signaling is minimized by using scenario dilemmas and trade-off framing
  rather than policy slogans or partisan cues
- Cross-axis richness is achieved by selecting scenarios where two dimensions
  are genuinely in tension — not artificially forced
- Complexity progression follows cognitive load: Basic = single clear trade-off,
  Intermediate = competing legitimate values, Advanced = structural ambiguity
  or second-order institutional effects

---

## Distribution Summary

| Axis                  | Basic | Intermediate | Advanced | Cross | Total |
|-----------------------|-------|-------------|---------|-------|-------|
| economic_organization | 2     | 3           | 1       | 3     | 6     |
| authority_liberty     | 2     | 2           | 2       | 3     | 6     |
| tradition_change      | 2     | 3           | 1       | 3     | 6     |
| nationalism_globalism | 2     | 3           | 1       | 3     | 6     |
| justice_model         | 2     | 2           | 2       | 3     | 6     |
| ecology_growth        | 2     | 3           | 1       | 3     | 6     |
| institutional_trust   | 2     | 2           | 2       | 3     | 6     |
| diversity_cohesion    | 2     | 2           | 2       | 3     | 6     |
| **TOTAL**             | **16+2=18** | **20** | **10** | **24** | **48** |

---

## Full Blueprint Table

| ID   | axis_id               | subtype              | complexity   | academic_basis                                    | constructs_measured                                      | cross_axis              | design_note                                                                 |
|------|-----------------------|----------------------|--------------|---------------------------------------------------|----------------------------------------------------------|-------------------------|-----------------------------------------------------------------------------|
| Q001 | economic_organization | scenario_dilemma     | basic        | Schwartz: Security; WVS: Economic Attitudes        | market preference, state intervention                    | none                    | Industrial job loss — market adjustment vs state rescue                    |
| Q002 | economic_organization | scenario_dilemma     | intermediate | WVS: Economic Attitudes; Haidt: Authority          | market power, regulatory legitimacy                      | authority_liberty       | Platform monopoly over payment infrastructure                               |
| Q003 | economic_organization | scenario_dilemma     | advanced     | WVS: Science; Schwartz: Benevolence                | deregulation tolerance, expert deference                 | institutional_trust     | Market deregulation disputed by independent agency                          |
| Q004 | economic_organization | policy_tradeoff      | basic        | Schwartz: Security; WVS: State Role                | fiscal conservatism, redistribution                      | none                    | Budget shortfall: austerity vs taxation                                     |
| Q005 | economic_organization | policy_tradeoff      | basic        | WVS: Economic Attitudes; ESS: Public Services      | privatization, infrastructure ownership                  | none                    | Private broadband monopoly vs public utility                               |
| Q006 | economic_organization | consistency_probe    | intermediate | WVS: Justice; Haidt: Fairness                      | corporate accountability, market rules                   | justice_model           | Profitable company causes legal but harmful externality                    |
| Q007 | authority_liberty     | scenario_dilemma     | basic        | Haidt: Authority; WVS: Civil Liberties             | surveillance tolerance, state overreach                  | none                    | Mandatory national biometric database                                       |
| Q008 | authority_liberty     | scenario_dilemma     | intermediate | Haidt: Authority; ESS: Trust; WVS: Security        | encryption rights, security apparatus trust              | institutional_trust     | Intelligence services vs encrypted communications                           |
| Q009 | authority_liberty     | scenario_dilemma     | advanced     | Haidt: Authority; MFT: Sanctity; Schwartz: Conform | religious assembly freedom vs local majority             | diversity_cohesion      | Minority religious center in resistant neighborhood                         |
| Q010 | authority_liberty     | policy_tradeoff      | basic        | WVS: Civil Liberties; ESS: Rule of Law             | detention without charge, habeas corpus                  | none                    | Extended pre-charge detention after violent attacks                         |
| Q011 | authority_liberty     | policy_tradeoff      | intermediate | Haidt: Liberty; WVS: Media Freedom                 | state speech regulation, disinformation framing          | none                    | Government-flagged political content removal mandates                       |
| Q012 | authority_liberty     | consistency_probe    | advanced     | Schwartz: Conformity; WVS: Democracy               | constitutional limits, democratic legitimacy             | tradition_change        | Executive abolishes century-old constitutional limit                        |
| Q013 | tradition_change      | scenario_dilemma     | basic        | Schwartz: Tradition; WVS: Cultural Values          | heritage vs utility, development trade-off               | none                    | Historic district vs high-density housing                                  |
| Q014 | tradition_change      | scenario_dilemma     | basic        | WVS: Cultural Values; ESS: National Identity       | curriculum reform, representation in education           | diversity_cohesion      | History curriculum: national narrative vs inclusive revision                |
| Q015 | tradition_change      | scenario_dilemma     | advanced     | Schwartz: Universalism; WVS: Globalization         | sovereignty, treaty compliance, reform velocity          | nationalism_globalism   | International trade agreement demands labor law harmonization               |
| Q016 | tradition_change      | policy_tradeoff      | basic        | Schwartz: Tradition; WVS: Marriage/Family          | definitional continuity vs legal equality                | none                    | Legal definition of marriage — traditional vs reformed                     |
| Q017 | tradition_change      | policy_tradeoff      | intermediate | WVS: National Identity; ESS: Social Cohesion       | memory politics, official commemoration                  | none                    | Contested historical anniversary — founding vs dispossession               |
| Q018 | tradition_change      | consistency_probe    | intermediate | Haidt: Authority; Schwartz: Tradition              | civic education, state vs family authority               | authority_liberty       | Mandatory national civic education after decades of voluntarism            |
| Q019 | nationalism_globalism | scenario_dilemma     | basic        | WVS: Sovereignty; ESS: International Trust         | binding global protocols, national autonomy              | none                    | Global health emergency requires binding national compliance                |
| Q020 | nationalism_globalism | scenario_dilemma     | intermediate | WVS: Trade; Schwartz: Universalism                 | trade retaliation, protectionism, multilateralism        | economic_organization   | Foreign industrial subsidy undercuts domestic producers                    |
| Q021 | nationalism_globalism | scenario_dilemma     | advanced     | WVS: Immigration; ESS: Social Cohesion             | cultural absorptive capacity, migration policy           | diversity_cohesion      | Large migration wave from culturally distant countries                      |
| Q022 | nationalism_globalism | policy_tradeoff      | basic        | WVS: Sovereignty; ESS: EU Attitudes                | supranational authority, legislative delegation          | none                    | Regional political union demands legislative transfer                      |
| Q023 | nationalism_globalism | policy_tradeoff      | intermediate | WVS: Climate; Schwartz: Universalism               | climate justice, international redistribution            | none                    | Global carbon fund demands contribution regardless of domestic record       |
| Q024 | nationalism_globalism | consistency_probe    | intermediate | ESS: Trust; WVS: International Institutions        | international institution trust, intelligence sharing    | institutional_trust     | Intelligence data-sharing protocol exposes citizens to foreign agencies    |
| Q025 | justice_model         | scenario_dilemma     | basic        | Haidt: Fairness; WVS: Crime                        | first-offender sentencing, rehabilitation vs deterrence  | none                    | First-time serious theft — rehabilitation path vs punitive signal          |
| Q026 | justice_model         | scenario_dilemma     | intermediate | Schwartz: Conformity; WVS: Technology              | algorithmic risk scoring, individual dignity             | authority_liberty       | Predictive probation algorithm using socioeconomic proxies                 |
| Q027 | justice_model         | scenario_dilemma     | advanced     | Haidt: Fairness; ESS: Discrimination               | disparate sentencing, structural vs individual judgment  | diversity_cohesion      | Demographic sentencing disparities trigger mandatory review proposal        |
| Q028 | justice_model         | policy_tradeoff      | basic        | WVS: Crime; Schwartz: Security                     | prison expansion vs prevention investment                | none                    | Prison vs rehabilitation: resource allocation choice                       |
| Q029 | justice_model         | policy_tradeoff      | intermediate | Haidt: Fairness; WVS: Economic Crime               | white-collar crime, custodial vs financial penalty       | none                    | Executive fraud: restitution vs incarceration                              |
| Q030 | justice_model         | consistency_probe    | intermediate | WVS: Rule of Law; Schwartz: Tradition              | mandatory minimums, judicial discretion, democratic will | tradition_change        | Mandatory minimum sentences vs judicial discretion in atypical cases        |
| Q031 | ecology_growth        | scenario_dilemma     | basic        | WVS: Environment; Schwartz: Universalism           | employment vs climate, fossil fuel development           | none                    | Coal reserves in poor region vs climate commitments                        |
| Q032 | ecology_growth        | scenario_dilemma     | intermediate | WVS: Environment; Schwartz: Universalism           | market incentives vs regulatory mandates for efficiency  | economic_organization   | Building environmental standards: mandate vs market                        |
| Q033 | ecology_growth        | scenario_dilemma     | advanced     | WVS: Science; ESS: Expert Trust                    | scientific expert panels vs ministry bureaucracy         | institutional_trust     | Land-use restriction backed by science, disputed by government ministry     |
| Q034 | ecology_growth        | policy_tradeoff      | basic        | WVS: Environment; ESS: Climate Policy              | fuel taxes (regressive) vs EV subsidies (inequitable)    | none                    | Carbon pricing instruments and distributional fairness                     |
| Q035 | ecology_growth        | policy_tradeoff      | intermediate | WVS: Environment; Schwartz: Benevolence            | fishing community vs stock recovery timeline             | none                    | Overexploited fishery: community income vs ecological timeline             |
| Q036 | ecology_growth        | consistency_probe    | intermediate | WVS: Climate; Schwartz: Universalism               | national targets met; global obligations beyond borders  | nationalism_globalism   | Post-target global burden-sharing: national vs global framing              |
| Q037 | institutional_trust   | scenario_dilemma     | basic        | WVS: Science Trust; ESS: Institutional Trust       | contested health intervention, expert authority          | none                    | Government health agency vs minority scientific dissent                    |
| Q038 | institutional_trust   | scenario_dilemma     | intermediate | WVS: Democracy; Haidt: Authority                   | judicial independence, democratic accountability         | authority_liberty       | Elected government attempts court restructuring after adverse rulings      |
| Q039 | institutional_trust   | scenario_dilemma     | intermediate | WVS: Economic Institutions; Schwartz: Conformity   | central bank independence, democratic mandate            | economic_organization   | Central bank raises rates vs elected government authority                  |
| Q040 | institutional_trust   | policy_tradeoff      | basic        | WVS: Corruption; ESS: Institutional Trust          | independent anti-corruption authority                    | none                    | Anti-corruption body with power to investigate sitting officials            |
| Q041 | institutional_trust   | policy_tradeoff      | intermediate | WVS: Health; ESS: Expert Trust                     | hospital consolidation: experts vs communities           | none                    | Expert commission vs community opposition on hospital closures             |
| Q042 | institutional_trust   | consistency_probe    | advanced     | WVS: Democracy; Schwartz: Tradition                | electoral reform, modeling-driven institutional change   | tradition_change        | Century-old electoral system replaced by evidence-based alternative        |
| Q043 | diversity_cohesion    | scenario_dilemma     | basic        | WVS: Equality; Haidt: Fairness                     | structured diversity hiring, merit framing               | none                    | Employer diversity program — merit-blind vs structured recruitment         |
| Q044 | diversity_cohesion    | scenario_dilemma     | intermediate | WVS: Immigration; ESS: Identity                    | civic values test for residency, ideological compliance  | nationalism_globalism   | Civic integration test as condition for permanent residency                |
| Q045 | diversity_cohesion    | scenario_dilemma     | advanced     | Haidt: Sanctity; Schwartz: Tradition               | religious dress exception vs uniform workplace norms     | tradition_change        | Religious dress code exception — inclusion vs workplace continuity         |
| Q046 | diversity_cohesion    | policy_tradeoff      | basic        | WVS: Education; ESS: Cultural Values               | unified national curriculum vs locally flexible          | none                    | Curriculum: civic unity vs cultural accommodation                          |
| Q047 | diversity_cohesion    | policy_tradeoff      | intermediate | WVS: Social Cohesion; ESS: Integration             | shared civic festivals vs community-specific events      | none                    | Public festival funding: shared civic vs fragmented community events        |
| Q048 | diversity_cohesion    | consistency_probe    | intermediate | Haidt: Fairness; ESS: Discrimination               | discriminatory policing pattern — structural vs security | justice_model           | Religious group over-policed far beyond behavioral base rate               |

---

## Cross-Axis Map (24 items)

| Primary Axis          | Secondary Axis        | Question IDs           |
|-----------------------|-----------------------|------------------------|
| economic_organization | authority_liberty     | Q002                   |
| economic_organization | institutional_trust   | Q003                   |
| economic_organization | justice_model         | Q006                   |
| authority_liberty     | institutional_trust   | Q008                   |
| authority_liberty     | diversity_cohesion    | Q009                   |
| authority_liberty     | tradition_change      | Q012                   |
| tradition_change      | diversity_cohesion    | Q014                   |
| tradition_change      | nationalism_globalism | Q015                   |
| tradition_change      | authority_liberty     | Q018                   |
| nationalism_globalism | economic_organization | Q020                   |
| nationalism_globalism | diversity_cohesion    | Q021                   |
| nationalism_globalism | institutional_trust   | Q024                   |
| justice_model         | authority_liberty     | Q026                   |
| justice_model         | diversity_cohesion    | Q027                   |
| justice_model         | tradition_change      | Q030                   |
| ecology_growth        | economic_organization | Q032                   |
| ecology_growth        | institutional_trust   | Q033                   |
| ecology_growth        | nationalism_globalism | Q036                   |
| institutional_trust   | authority_liberty     | Q038                   |
| institutional_trust   | economic_organization | Q039                   |
| institutional_trust   | tradition_change      | Q042                   |
| diversity_cohesion    | nationalism_globalism | Q044                   |
| diversity_cohesion    | tradition_change      | Q045                   |
| diversity_cohesion    | justice_model         | Q048                   |

**Total cross-axis: 24 / 48 (50%) — exceeds minimum requirement of 12**
