import { Poll, PollOption, CreatePollData } from '../types/Poll';

const STORAGE_KEY = 'anonymous-polls';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const savePolls = (polls: Poll[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(polls));
};

export const loadPolls = (): Poll[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    const polls = JSON.parse(data);
    return polls.map((poll: any) => ({
      ...poll,
      createdAt: new Date(poll.createdAt)
    }));
  } catch {
    return [];
  }
};

export const createPoll = (data: CreatePollData): Poll => {
  const polls = loadPolls();
  
  const poll: Poll = {
    id: generateId(),
    question: data.question,
    options: data.options.map(text => ({
      id: generateId(),
      text,
      votes: 0
    })),
    createdAt: new Date(),
    totalVotes: 0
  };
  
  polls.push(poll);
  savePolls(polls);
  
  return poll;
};

export const getPoll = (id: string): Poll | null => {
  const polls = loadPolls();
  return polls.find(poll => poll.id === id) || null;
};

export const votePoll = (pollId: string, optionId: string): Poll | null => {
  const polls = loadPolls();
  const pollIndex = polls.findIndex(poll => poll.id === pollId);
  
  if (pollIndex === -1) return null;
  
  const poll = polls[pollIndex];
  const option = poll.options.find(opt => opt.id === optionId);
  
  if (!option) return null;
  
  option.votes++;
  poll.totalVotes++;
  
  savePolls(polls);
  
  return poll;
};