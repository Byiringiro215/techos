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
import { ChevronLeft, ChevronRight, Clock, MapPin, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useCalendarEvents,
  useCreateCalendarEvent,
  useDeleteCalendarEvent,
} from '@/hooks/useCalendar';
import { Badge } from '@/components/UI/Badge';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { Modal } from '@/components/UI/Modal';
import { PageHeader } from '@/components/UI/PageHeader';
import { Input } from '@/components/UI/Input';
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

type BoardEvent = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  location?: string;
  description?: string;
};

function toBoardEvent(row: any): BoardEvent {
  const start = row.start_datetime || row.start_time || row.start;
  const end = row.end_datetime || row.end_time || row.end;
  const startDate = start ? new Date(start) : new Date();
  const endDate = end ? new Date(end) : startDate;
  return {
    id: row.id,
    title: row.title || 'Event',
    date: format(startDate, 'yyyy-MM-dd'),
    startTime: format(startDate, 'HH:mm'),
    endTime: format(endDate, 'HH:mm'),
    type: row.type || 'meeting',
    location: row.location,
    description: row.description,
  };
}

export function CalendarBoard({ breadcrumbs }: CalendarBoardProps) {
  const [cursor, setCursor] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeEvent, setActiveEvent] = useState<BoardEvent | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState('');

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const { data: rawEvents = [], isLoading } = useCalendarEvents(
    monthStart.toISOString(),
    monthEnd.toISOString(),
  );
  const createEvent = useCreateCalendarEvent();
  const deleteEvent = useDeleteCalendarEvent();

  const events = useMemo(() => (rawEvents || []).map(toBoardEvent), [rawEvents]);

  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const eventsByDate = useMemo(() => {
    const map = new Map<string, BoardEvent[]>();
    for (const event of events) {
      const list = map.get(event.date) || [];
      list.push(event);
      map.set(event.date, list);
    }
    return map;
  }, [events]);

  const selectedKey = format(selectedDate, 'yyyy-MM-dd');
  const dayEvents = (eventsByDate.get(selectedKey) || []).sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  const addQuickEvent = async () => {
    const start = `${selectedKey}T09:00:00.000Z`;
    const end = `${selectedKey}T10:00:00.000Z`;
    await createEvent.mutateAsync({
      title: title.trim() || 'New event',
      start_datetime: start,
      end_datetime: end,
      type: 'meeting',
      all_day: false,
    } as any);
    setTitle('');
    setCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Schedule meetings, deadlines, and reminders."
        breadcrumbs={breadcrumbs}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New event
          </Button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-ink">{format(cursor, 'MMMM yyyy')}</h3>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setCursor(subMonths(cursor, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCursor(new Date())}>
                Today
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCursor(addMonths(cursor, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <p className="text-sm text-ink-muted py-8 text-center">Loading schedule...</p>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="text-center text-xs text-ink-muted py-1">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const key = format(day, 'yyyy-MM-dd');
                  const dayList = eventsByDate.get(key) || [];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        'min-h-[84px] rounded-lg border p-1.5 text-left transition-colors',
                        isSameMonth(day, cursor) ? 'bg-surface border-border' : 'bg-bg-muted/40 border-transparent text-ink-muted',
                        isSameDay(day, selectedDate) && 'ring-2 ring-brand/40 border-brand/30',
                        isToday(day) && 'bg-brand-mist/40',
                      )}
                    >
                      <span className="text-xs font-medium">{format(day, 'd')}</span>
                      <div className="mt-1 space-y-0.5">
                        {dayList.slice(0, 2).map((ev) => (
                          <div
                            key={ev.id}
                            className={cn('truncate rounded px-1 text-[10px]', TYPE_STYLES[ev.type] || TYPE_STYLES.event)}
                          >
                            {ev.title}
                          </div>
                        ))}
                        {dayList.length > 2 && (
                          <p className="text-[10px] text-ink-muted">+{dayList.length - 2} more</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-ink mb-3">{format(selectedDate, 'EEEE, MMM d')}</h3>
          <div className="space-y-2">
            {dayEvents.length === 0 && (
              <p className="text-sm text-ink-muted">No events scheduled.</p>
            )}
            {dayEvents.map((ev) => (
              <button
                key={ev.id}
                type="button"
                onClick={() => setActiveEvent(ev)}
                className="w-full text-left rounded-lg border border-border p-3 hover:bg-bg-muted transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{ev.title}</p>
                  <Badge size="sm">{ev.type}</Badge>
                </div>
                <p className="text-xs text-ink-muted mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {ev.startTime} – {ev.endTime}
                </p>
                {ev.location && (
                  <p className="text-xs text-ink-muted mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {ev.location}
                  </p>
                )}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="New event">
        <div className="space-y-4">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Team sync" />
          <p className="text-xs text-ink-muted">Scheduled on {selectedKey} from 09:00–10:00 (UTC).</p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button loading={createEvent.isPending} onClick={addQuickEvent}>
              Create
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!activeEvent} onClose={() => setActiveEvent(null)} title={activeEvent?.title || 'Event'}>
        {activeEvent && (
          <div className="space-y-4">
            <p className="text-sm text-ink-secondary">{activeEvent.description || 'No description'}</p>
            <p className="text-xs text-ink-muted">
              {activeEvent.date} · {activeEvent.startTime}–{activeEvent.endTime}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="danger"
                loading={deleteEvent.isPending}
                onClick={async () => {
                  await deleteEvent.mutateAsync(activeEvent.id);
                  setActiveEvent(null);
                  toast.success('Event deleted');
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button onClick={() => setActiveEvent(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
