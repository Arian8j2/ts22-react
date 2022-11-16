import RankStatus from './dashboard/rankstatus';
import Summary from './dashboard/summary';
import Reffer from './dashboard/reffer';

export default function Dashboard() {
  return (
    <div id="dashboard">
      <RankStatus />
      <Summary />
      <Reffer />
    </div>
  );
}
