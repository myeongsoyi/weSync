import Navigation from '@/components/common/navigations/navMain';
import Invite from '@/components/invite';

interface IParams {
  params: { code: string };
}

export default function InvitePage({ params: { code } }: IParams) {
  return (
    <div>
      <Navigation />
      <div className="content">
        <Invite code={code} />
      </div>
    </div>
  );
}
