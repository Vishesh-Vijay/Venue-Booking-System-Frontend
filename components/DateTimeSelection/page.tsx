import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment-timezone";
interface Event {
    booking_status: string;
    booking_time: string;
    booking_type: string;
    description: string;
    event_duration: number;
    event_time: Date;
    expected_strength: Number;
    id: string;
    last_updated_time: string;
    title: string;
    user_id: string;
    venue_id: string;
}
interface DateTimeSelectionProps {
    bookings: Event[];
    eventTime: string;
    eventDuration: number;
    onEventTimeChange: (eventTime: string) => void;
    onEventDurationChange: (eventDuration: number) => void;
}
const DateTimeSelection = ({
    bookings,
    eventTime,
    eventDuration,
    onEventTimeChange,
    onEventDurationChange,
}: DateTimeSelectionProps) => {
    const calendarRef = useRef<FullCalendar>(null);
    const handleDateSelect = (selectInfo: any) => {
        const start = selectInfo.startStr;
        const end = selectInfo.endStr;
        console.log(start);
        onEventTimeChange(start);
        const duration = moment(end).diff(moment(start), "minutes");
        onEventDurationChange(duration);
    };
    const validRange = {
        start: moment().format(),
        currentTime: moment().toISOString(),
    };
    const selectAllow = (selectInfo: any) => {
        const now = moment();
        const selectedStart = moment(selectInfo.startStr);
        return selectedStart.isSameOrAfter(now);
    };
    console.log(bookings)
    const approvedBookings = bookings.filter(booking => booking.booking_status.toLowerCase()=="approved")
    const events = approvedBookings.map((booking) => ({
        title: booking.title,
        start: moment(booking.event_time).format(),
        end: moment(booking.event_time)
            .add(booking.event_duration, "minutes")
            .local()
            .format(),
    }));
    useEffect(() => {
        moment.locale("en-in");
        moment.tz.setDefault("Asia/Kolkata");
    }, []);
    useEffect(() => {
        if (eventTime && calendarRef.current) {
            calendarRef.current
                .getApi()
                .select(
                    eventTime,
                    moment(eventTime).add(eventDuration, "minutes").format()
                );
        }
    }, [eventTime, eventDuration]);
    return (
        <>
            <div className="m-4">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[
                        interactionPlugin,
                        dayGridPlugin,
                        timeGridPlugin,
                        listPlugin,
                    ]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "timeGridWeek,timeGridDay,listWeek",
                    }}
                    footerToolbar={false}
                    events={events}
                    timeZone="Asia/Kolkata"
                    selectable={true}
                    unselectAuto={true}
                    selectOverlap={false}
                    select={handleDateSelect}
                    validRange={validRange}
                    selectAllow={selectAllow}
                />
            </div>
        </>
    );
};
export default DateTimeSelection;
