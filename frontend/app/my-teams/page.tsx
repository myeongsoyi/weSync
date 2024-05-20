import Navigation from '@/components/common/navigations/navMain';
import MyTeams from '@/components/my-teams/myTeams';

export default function MyTeamsPage() {
  return (
    <div>
      <Navigation />
      <div className="content">
        <MyTeams />
      </div>
    </div>
  );
}
