import Navigation from '@/components/common/navigations/navMain';
import MainTeams from '@/components/home/mainTeams';
import MainRecords from '@/components/home/mainRecords';

export default function HomePage() {
  return (
    <div>
      <Navigation />
      <div className="content">
        <MainTeams />
        <MainRecords />
      </div>
    </div>
  );
}
