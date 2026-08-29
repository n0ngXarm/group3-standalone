import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { QteChallenge } from './Challenges.jsx';

const mockChallenge = {
  answer: 'A',
  prompt: {
    zh: '王一飞跟谁打招呼？',
    pinyin: 'Wáng Yīfēi gēn shéi dǎ zhāohu?',
    th: 'อาจารย์หวังอี้เฟยทักทายใคร?'
  },
  options: [
    { value: 'A', zh: '小语', pinyin: 'Xiǎoyǔ', th: 'เสี่ยวหวี่' },
    { value: 'B', zh: '陈天中', pinyin: 'Chén Tiānzhōng', th: 'เฉินเทียนจง' }
  ]
};

vi.mock('../../../../../shared/components/ui/Icon.jsx', () => ({
  default: () => <svg data-testid="icon" />
}));

describe('QTE Challenge UX', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  it('wrong answer keeps QTE active and permits second selection', () => {
    render(<QteChallenge challenge={mockChallenge} language="th" timed={false} />);
    
    const optionB = screen.getByText('陈天中').closest('button');
    fireEvent.click(optionB);
    
    // QTE stays active, button B is disabled but A is not
    expect(screen.getByText('ตอบผิด 1 ครั้ง')).toBeInTheDocument();
    expect(optionB).toBeDisabled();
    
    const optionA = screen.getByText('小语').closest('button');
    expect(optionA).not.toBeDisabled();
  });

  it('question and option Pinyin are non-empty', () => {
    render(<QteChallenge challenge={mockChallenge} language="th" timed={false} />);
    
    // Question pinyin
    expect(screen.getByText('Wáng Yīfēi gēn shéi dǎ zhāohu?')).toBeInTheDocument();
    // Option pinyin
    expect(screen.getByText('Xiǎoyǔ')).toBeInTheDocument();
  });

  it('timer 1->0 triggers timeout exactly once', () => {
    render(<QteChallenge challenge={mockChallenge} language="th" timed={true} />);
    
    act(() => {
      vi.advanceTimersByTime(15100);
    });
    
    expect(screen.getByText('⚠️ หมดเวลา')).toBeInTheDocument();
    
    // timer never negative
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('timeout retry resets timer and retains wrongAttempts', () => {
    render(<QteChallenge challenge={mockChallenge} language="th" timed={true} />);
    
    act(() => {
      vi.advanceTimersByTime(15100);
    });
    
    expect(screen.getByText('⚠️ หมดเวลา')).toBeInTheDocument();
    
    // Retry
    const retryBtn = screen.getByText('ลองอีกครั้ง');
    fireEvent.click(retryBtn);
    
    expect(screen.queryByText('⚠️ หมดเวลา')).not.toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    // wrong attempts was incremented
    expect(screen.getByText('ตอบผิด 1 ครั้ง')).toBeInTheDocument();
  });
});
