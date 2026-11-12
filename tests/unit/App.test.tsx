import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';

describe('App component (Integration Test)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders all 3 modules, hero section and official sources', () => {
    render(<App />);

    // Header title
    expect(screen.getByText('Курс: Как работать с AI осознанно')).toBeInTheDocument();

    // 3 Modules (headings)
    expect(screen.getByRole('heading', { name: 'Постановка задачи и выбор модели' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Контроль качества: планирование и двухмодельный подход' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Автономия: от чата к агентам' })).toBeInTheDocument();

    // Sources
    expect(screen.getByText('Официальная документация и проверенные источники')).toBeInTheDocument();
  });

  it('updates progress when a lesson is marked as completed', () => {
    render(<App />);

    // Initial state: 0/8 тем
    expect(screen.getByText('0/8 тем')).toBeInTheDocument();

    // Click "Отметить как изученное" on Topic 1
    const markButtons = screen.getAllByRole('button', { name: /отметить как изученное/i });
    fireEvent.click(markButtons[0]);

    // Progress updates to 1/8 тем
    expect(screen.getByText('1/8 тем')).toBeInTheDocument();
  });

  it('handles reset confirmation workflow', () => {
    render(<App />);

    // Click "Начать заново"
    const resetTrigger = screen.getByRole('button', { name: /начать заново/i });
    fireEvent.click(resetTrigger);

    // Confirmation options appear
    expect(screen.getByText('Сбросить всё?')).toBeInTheDocument();
    const yesButton = screen.getByRole('button', { name: 'Да' });
    const noButton = screen.getByRole('button', { name: 'Нет' });
    expect(yesButton).toBeInTheDocument();
    expect(noButton).toBeInTheDocument();

    // Click "Да"
    fireEvent.click(yesButton);
    expect(screen.getByText('0/8 тем')).toBeInTheDocument();
  });
});
