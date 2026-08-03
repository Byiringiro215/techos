'use client';

import { useMemo, useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, MapPin, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { mockCalendarEvents, type CalendarEvent } from '@/mocks';
import { Badge } from '@/components/UI/Badge';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { Modal } from '@/components/UI/Modal';
import { PageHeader } from '@/components/UI/PageHeader';
import { cn } from '@/lib/utils';

const TYPE_STYLES: Record<string, string> = {
  meeting: 'bg-brand text-ink-inverse',
  deadline: 'bg-warning text-ink-inverse',
  reminder: 'bg-info-soft text-info-text',
  interview: 'bg-success text-ink-inverse',
  review: 'bg-bg-inverse text-ink-inverse',
  event: 'bg-brand-soft text-ink-inverse',
};

interface CalendarBoardProps {
  breadcrumbs?: { label: string; href?: string }[];
}

export function CalendarBoard({ breadcrumbs }: CalendarBoardProps) {
  const [cursor, setCursor] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(mockCalendarEvents);
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const key = event.date;
      const list = map.get(key) || [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [events]);

  const selectedKey = format(selectedDate, 'yyyy-MM-dd');
  const dayEvents = (eventsByDate.get(selectedKey) || []).sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  const addQuickEvent = () => {
    const id = `evt-${Date.now()}`;
    const event: CalendarEvent = {
      id,
      title: 'New event',
      date: selectedKey,
      startTime: '09:00',
      endTime: '10:00',
      type: 'meeting',
      color: 'info',
      location: 'Zoom',
      description: 'Created from calendar (mock).',
    };
    setEvents((prev) => [...prev, event]);
    setActiveEvent(event);
    toast.success('Event added (mock)');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Plan meetings, deadlines, and reviews across your workspace."
        breadcrumbs={breadcrumbs}
        actions={
          <Button size="sm" onClick={addQuickEvent}>
            <Plus className="h-4 w-4 mr-2" />
            New event
          </Button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
        <Card padding="none" className="overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
            <div>
              <h2 className="text-lg font-semibold text-ink">{format(cursor, 'MMMM yyyy')}</h2>
              <p className="text-xs text-ink-muted mt-0.5">
                {events.filter((e) => e.date.startsWith(format(cursor, 'yyyy-MM'))).length} events this month
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>
                Today
              </Button>
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => setCursor((d) => subMonths(d, 1))}
                className="p-2 rounded-xl border border-border text-ink-secondary hover:bg-surface-hover"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => setCursor((d) => addMonths(d, 1))}
                className="p-2 rounded-xl border border-border text-ink-secondary hover:bg-surface-hover"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-border bg-bg-muted">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="px-2 py-2.5 text-center text-xs font-semibold text-ink-muted uppercase tracking-wide">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 auto-rows-[minmax(96px,1fr)]">
            {days.map((day) => {
              const key = format(day, 'yyyy-MM-dd');
              const dayItems = eventsByDate.get(key) || [];
              const inMonth = isSameMonth(day, cursor);
              const selected = isSameDay(day, selectedDate);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    'min-h-[96px] border-r border-b border-border p-2 text-left transition-colors align-top',
                    !inMonth && 'bg-bg-muted/50 text-ink-muted',
                    selected && 'bg-brand-mist/70 ring-2 ring-inset ring-brand/40',
                    inMonth && !selected && 'hover:bg-surface-hover',
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={cn(
                        'inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
                        isToday(day) && 'bg-brand text-ink-inverse',
                        !isToday(day) && selected && 'text-brand font-semibold',
                        !isToday(day) && !selected && (inMonth ? 'text-ink' : 'text-ink-muted'),
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                    {dayItems.length > 2 && (
                      <span className="text-[10px] text-ink-muted">+{dayItems.length - 2}</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {dayItems.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          'truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium',
                          TYPE_STYLES[event.type] || TYPE_STYLES.event,
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDate(day);
                          setActiveEvent(event);
                        }}
                      >
                        {event.startTime !== '00:00' ? `${event.startTime} ` : ''}
                        {event.title}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Selected day</p>
            <h3 className="text-lg font-semibold text-ink mt-1">{format(selectedDate, 'EEEE, MMM d')}</h3>
            <p className="text-sm text-ink-muted mt-1">{dayEvents.length} event{dayEvents.length === 1 ? '' : 's'}</p>
            <Button className="w-full mt-4" variant="outline" size="sm" onClick={addQuickEvent}>
              <Plus className="h-4 w-4 mr-2" />
              Add to this day
            </Button>
          </Card>

          <Card padding="none" className="overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-ink">Agenda</h3>
            </div>
            {dayEvents.length === 0 ? (
              <div className="p-6 text-sm text-ink-muted text-center">No events scheduled.</div>
            ) : (
              <ul className="divide-y divide-border max-h-[480px] overflow-y-auto">
                {dayEvents.map((event) => (
                  <li key={event.id}>
                    <button
                      type="button"
                      onClick={() => setActiveEvent(event)}
                      className="w-full text-left px-4 py-3 hover:bg-surface-hover transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-ink">{event.title}</p>
                        <Badge variant={event.color || 'info'} size="sm">
                          {event.type}
                        </Badge>
                      </div>
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-muted">
                        <Clock className="h-3.5 w-3.5" />
                        {event.startTime} – {event.endTime}
                      </p>
                      {event.location && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.location}
                        </p>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <Modal
        isOpen={!!activeEvent}
        onClose={() => setActiveEvent(null)}
        title={activeEvent?.title || 'Event'}
        size="md"
      >
        {activeEvent && (
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-2">
              <Badge variant={activeEvent.color || 'info'}>{activeEvent.type}</Badge>
              <Badge variant="default">{activeEvent.date}</Badge>
            </div>
            <p className="text-ink-secondary">{activeEvent.description}</p>
            <dl className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-ink-muted text-xs">Time</dt>
                <dd className="text-ink mt-1">
                  {activeEvent.startTime} – {activeEvent.endTime}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted text-xs">Location</dt>
                <dd className="text-ink mt-1">{activeEvent.location || '—'}</dd>
              </div>
            </dl>
            {activeEvent.attendees && activeEvent.attendees.length > 0 && (
              <div>
                <p className="text-xs text-ink-muted mb-2">Attendees</p>
                <div className="flex flex-wrap gap-2">
                  {activeEvent.attendees.map((a) => (
                    <span key={a} className="rounded-full bg-bg-muted px-2.5 py-1 text-xs text-ink-secondary">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setEvents((prev) => prev.filter((e) => e.id !== activeEvent.id));
                  setActiveEvent(null);
                  toast.success('Event removed (mock)');
                }}
              >
                Delete
              </Button>
              <Button size="sm" onClick={() => setActiveEvent(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
