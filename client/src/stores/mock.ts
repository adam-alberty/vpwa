// Temp
export const messages: Message[] = [
  {
    id: 'c1e1e2f7-4a2a-453e-b5f7-8d964fa9c0a1',
    username: 'alice',
    text: 'Hey, are we still on for the meeting later?',
    timestamp: '2025-10-08T09:00:00.000Z',
  },
  {
    id: 'f2b9d49a-87b0-4c8e-b9a3-b1740934f207',
    username: 'bob',
    text: "Yes, let's start at 3pm like we planned.",
    timestamp: '2025-10-08T09:02:00.000Z',
  },
  {
    id: '2c3dbe53-4f57-4d76-95c4-0a12d083c5d4',
    username: 'charlie',
    text: "Don't forget to check the budget report.",
    timestamp: '2025-10-08T09:04:00.000Z',
  },
  {
    id: 'a5e83bce-ecc6-4e3f-81c2-b2a7c00b13cb',
    username: 'diana',
    text: 'Already reviewed it, looks good to me.',
    timestamp: '2025-10-08T09:06:00.000Z',
  },
  {
    id: 'abf14d3a-f3ff-4df6-90aa-78bfa1aaac5a',
    username: 'eve',
    text: "I'll upload the final draft in a moment.",
    timestamp: '2025-10-08T09:08:00.000Z',
  },
  {
    id: '44ea26f4-8599-4999-922d-28040f2ac1f9',
    username: 'bob',
    text: 'Thanks! Really appreciate the help.',
    timestamp: '2025-10-08T09:10:00.000Z',
  },
  {
    id: '95fcd5de-7861-4e46-8234-d2369c82acb0',
    username: 'alice',
    text: 'No problem. Let me know if anything else comes up.',
    timestamp: '2025-10-08T09:12:00.000Z',
  },
  {
    id: '80f6aa6d-3b11-4fae-8ff5-d460a1eb8db5',
    username: 'charlie',
    text: 'Can someone take over the notes during the meeting?',
    timestamp: '2025-10-08T09:14:00.000Z',
  },
  {
    id: 'b1a35c2e-9c79-47fa-91a1-0130fae5f361',
    username: 'diana',
    text: 'I can do it.',
    timestamp: '2025-10-08T09:16:00.000Z',
  },
  {
    id: '3190e6e2-16ec-4a4f-8c2f-06b7e77ab8d0',
    username: 'eve',
    text: "Great! I'll send the agenda shortly.",
    timestamp: '2025-10-08T09:18:00.000Z',
  },
  {
    id: 'db16ad0c-c1fc-4e2f-90b4-22edc37f9d62',
    username: 'bob',
    text: 'Make sure to include the Q4 targets discussion.',
    timestamp: '2025-10-08T09:20:00.000Z',
  },
  {
    id: '3c588173-20c2-40cf-8855-18f82a836e1a',
    username: 'alice',
    text: 'Will do. Also adding the client feedback review.',
    timestamp: '2025-10-08T09:22:00.000Z',
  },
  {
    id: 'ae528839-3e2d-4f7a-950b-82c5c9cbe3f9',
    username: 'charlie',
    text: 'Is the design mockup finalized?',
    timestamp: '2025-10-08T09:24:00.000Z',
  },
  {
    id: 'f0f826db-e1d2-4e7a-b92b-3cc84eeff67c',
    username: 'diana',
    text: 'Not yet, still waiting on a few assets.',
    timestamp: '2025-10-08T09:26:00.000Z',
  },
  {
    id: '1a3bd6a0-4047-4469-8e11-9c0b3e91a84d',
    username: 'eve',
    text: "I'll ping the design team to speed things up.",
    timestamp: '2025-10-08T09:28:00.000Z',
  },
];

export const channels: Channel[] = [
  {
    id: 'd8f0c9e1-b5f4-49b6-95d2-91f5b81f3e31',
    name: 'frontend-dev',
    lastMessage: 'alex: Can someone review my PR for the navbar updates?',
  },
  {
    id: 'c24b9b97-04f3-4479-b22e-52c1dbd8ad1d',
    name: 'product-roadmap',
    lastMessage: 'maria: I’ve updated the Q4 goals in the doc, feedback welcome.',
  },
  {
    id: 'a56c42f9-319c-4e95-9cf6-df6b0a4e35c2',
    name: 'general',
    lastMessage: 'josh: Reminder: All hands at 2pm today!',
  },
  {
    id: 'fb9f9983-184f-42ad-b430-9c4125bbd70f',
    name: 'channel-with-very-very-long-name',
    lastMessage: 'lina: Pushed the latest Figma updates for the onboarding flow.',
  },
  {
    id: '1a3c3dd3-6a76-4f1d-9b49-4565c69e30ff',
    name: 'customer-support',
    lastMessage: 'ben: Ticket #3487 needs escalation — login still failing.',
  },
  {
    id: 'd61cb376-ef84-4521-a53e-7b167dd0c37a',
    name: 'random',
    lastMessage: 'chloe: Anyone else trying the new coffee place on 3rd?',
  },
  {
    id: 'ee6e63c1-3cf2-4bc1-950b-41b68220b3a7',
    name: 'qa-testing',
    lastMessage: 'samir: Found a bug in the checkout flow on iOS.',
  },
  {
    id: 'f96a119e-39f2-404e-88fc-1c6727e11673',
    name: 'backend-infra',
    lastMessage: 'dan: Deployed the hotfix to production. Monitoring logs now.',
  },
  {
    id: '3785b8f3-96e4-4fd0-a6ec-2c842e877eab',
    name: 'marketing',
    lastMessage: 'tina: Drafted copy for the new landing page — thoughts?',
  },
  {
    id: 'c8fd594e-4de6-4fc4-8231-1c4dfabaf70a',
    name: 'sales-leads',
    lastMessage: 'rob: Meeting with Acme Corp went well. Follow-up scheduled.',
  },
  {
    id: '6af043bd-d7c4-4d2e-9f29-2e8a2e746d91',
    name: 'devops',
    lastMessage: 'nina: Pipeline failed on staging — investigating now.',
  },
  {
    id: 'e4a17e93-dae5-40ae-9c24-d4b16a20bb5e',
    name: 'weekly-sync',
    lastMessage: 'matt: Can we push the meeting to 3pm?',
  },
  {
    id: '37d7ebf4-e8cc-470e-a3ed-41b2353a0c49',
    name: 'support-escalations',
    lastMessage: 'dave: Customer still seeing 500 errors after patch.',
  },
  {
    id: '9eaf07e7-43e4-4f9a-ae1c-12cfb3793427',
    name: 'hiring',
    lastMessage: 'sara: Two new resumes in the shared folder.',
  },
  {
    id: '73dc38a0-61e7-4701-8c9b-3cd8b6c21490',
    name: 'mobile-app',
    lastMessage: 'ken: Pushed the latest build to TestFlight.',
  },
  {
    id: '2fa6d3a1-bba2-43ff-b3a6-e94e027d7a2c',
    name: 'ux-feedback',
    lastMessage: 'julia: Users are confused by the onboarding step 3.',
  },
  {
    id: 'b1a9ed36-1d74-4098-913f-826d0558c1ce',
    name: 'engineering',
    lastMessage: 'leo: API v2 is now live 🚀',
  },
  {
    id: '90a81f5f-650a-406f-8c5f-155e9f4f2ac0',
    name: 'analytics',
    lastMessage: 'emma: September traffic up 12% from last month.',
  },
  {
    id: 'c3cba6b2-27f7-4cbb-a3a6-67210e943e6d',
    name: 'partners',
    lastMessage: 'jack: Call with Stripe team moved to Thursday.',
  },
  {
    id: '7ddfb61c-cde5-4bb1-94dc-06b5eb173b87',
    name: 'social-media',
    lastMessage: 'mia: Scheduled the October posts — ready for review.',
  },
];

function seededRandom(seed = 123) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;

  return function () {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function pickRandom<T>(array: T[], n = 1, seed = 123) {
  const rand = seededRandom(seed);
  const copy = [...array];
  const result: T[] = [];

  for (let i = 0; i < n && copy.length > 0; i++) {
    const index = Math.floor(rand() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }

  return result;
}

export function getRandomMessages(n = 1, seed = 123) {
  return pickRandom(messages, n, seed);
}

export function getRandomChannels(n = 1, seed = 123) {
  return pickRandom(channels, n, seed);
}
