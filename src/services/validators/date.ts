import {DateTime} from "luxon";

const Date:TypeDescriptor<DateTime> = {
  id: 'date',
  type: 'date',
  in: (val: string) => DateTime.fromISO(val),
  out: (val: DateTime) => val.toFormat('yyyy-MM-dd')
};

export default Date;
