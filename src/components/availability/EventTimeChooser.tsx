import {DateTime} from "luxon";
import Button from "../inline/Button";
import React, {useEffect, useState} from "react";
import $c from "classnames";
import {IAvailabilityBase} from "squad-shared";
import {gql, useMutation} from "@apollo/client";
import {useApp} from "../../hooks/useApp";
import {GET_SUMMARIES} from "../../services/api/event";

interface EventAvailabilityChooserProps {
  eventId: number;
  availabilities: IAvailabilityBase[];
  onSubmit: () => void;
  isAdmin?: boolean;
}

const EventAvailabilityChooser = ({
  eventId, availabilities, onSubmit, isAdmin
}: EventAvailabilityChooserProps) => {
  const {
    notif: { addNotice }
  } = useApp();
  const [chosenAvailability, setChosenAvailability] = useState<IAvailabilityBase | null>(availabilities[0]);
  const [publishEventTime, { data, loading }] = useMutation(gql`
    mutation PublishEventTime($eventId: Float!, $start: Date!, $end: Date!) {
      publishEventTime(eventId: $eventId, start: $start, end: $end) {
        success
        result
      }
    }
  `, {
    variables: {
      eventId,
      start: chosenAvailability?.start.toISO(),
      end: chosenAvailability?.end.toISO()
    },
    refetchQueries: [
      { query: GET_SUMMARIES }
    ]
  });

  useEffect(() => {
    if(chosenAvailability !== null && !availabilities.includes(chosenAvailability!)) setChosenAvailability(null);
  }, [availabilities])
  
  useEffect(() => {
    if(data?.publishEventTime?.success === true) {
      addNotice({
        id: 'event-time-published',
        level: 'success',
        message: 'Event time published',
        dismissable: true,
        timeout: 10000
      });
      
      onSubmit();
    }
  }, [data])
  
  const onClickSubmit = () => publishEventTime();
  
  if(!isAdmin) {
    return (
      <main className={'p-3 min-w-[390px] min-h-[300px] flex flex-col'}>
        <h2 className={'mb-16'}>Event Times</h2>
        
        <div className={'max-w-xs text-center mb-16'}>
          Event times will display here once they are published. Please check back again later!
        </div>
        
        <footer className={'text-center'}>
          Thank you for choosing Squad!
        </footer>
      </main>
    )
  }

  return (
    <main className={'p-3 min-w-[390px] min-h-[300px] flex flex-col justify-between'}>
      <h2 className={'mb-5'}>Choose Event Time:</h2>
      <section>
        { availabilities.length > 0 && availabilities.map((availability, index) =>
          <div
            key={index}
            className={$c('p-2 cursor-pointer', {
              'bg-violet-100': chosenAvailability === availability
            })}
            onClick={() => setChosenAvailability(availability)}
            data-cy={`event:time:${index}`}
          >
            { availability.start.toLocaleString(DateTime.DATETIME_SHORT) }
            {' -> '}
            { availability.end.toLocaleString(DateTime.DATETIME_SHORT) }
          </div>
        )}
      </section>
      
      <footer className={'center justify-center mt-3'}>
        <Button
          variant={'submit'}
          disabled={!chosenAvailability || loading}
          onClick={onClickSubmit}
          data-cy={'submit:event:time'}
        >
          Submit
        </Button>
      </footer>
    </main>
  )
};

export default EventAvailabilityChooser;
