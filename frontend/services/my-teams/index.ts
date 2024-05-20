import APIModule from '@/utils/apiModule';

// export async function getMyTeams() {
//   const teams = [
//     {
//       id: 1,
//       name: '팀1',
//       song: '노래1',
//       isEnd: false,
//       endDate: '',
//       myPosition: {
//         position: '포지션1',
//         color: '#0085FF',
//       },
//       teamImg: 'svgs/team-temp.svg',
//       members: [
//         {
//           id: 1,
//           name: '멤버1',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: true,
//         },
//         {
//           id: 2,
//           name: '멤버2',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 3,
//           name: '멤버3',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 4,
//           name: '멤버4',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 5,
//           name: '멤버5',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 6,
//           name: '멤버6',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 7,
//           name: '멤버7',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 8,
//           name: '멤버8',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 9,
//           name: '멤버9',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//       ],
//     },
//     {
//       id: 2,
//       name: '팀2 asdd asdaAWAWDDAS ASDAssdsd',
//       song: '노래2 asdasdsa asdasd asdaefggf hjgjm',
//       isEnd: false,
//       endDate: '',
//       myPosition: {
//         position: '포지션2',
//         color: '#FFD700',
//       },
//       teamImg: 'svgs/team-temp.svg',
//       members: [
//         {
//           id: 1,
//           name: '멤버1',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: true,
//         },
//         {
//           id: 2,
//           name: '멤버2',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 3,
//           name: '멤버3',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//       ],
//     },
//     {
//       id: 3,
//       name: '팀3',
//       song: '노래3',
//       isEnd: false,
//       endDate: '',
//       myPosition: {
//         position: '포지션3',
//         color: '#FF0000',
//       },
//       teamImg: 'svgs/team-temp.svg',
//       members: [
//         {
//           id: 1,
//           name: '멤버1',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: true,
//         },
//         {
//           id: 2,
//           name: '멤버2',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 3,
//           name: '멤버3',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 4,
//           name: '멤버4',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 5,
//           name: '멤버5',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//       ],
//     },
//     {
//       id: 5,
//       name: '팀5',
//       song: '노래5',
//       isEnd: true,
//       endDate: '2024-04-28',
//       myPosition: {
//         position: '포지션3',
//         color: '#FF0000',
//       },
//       teamImg: 'svgs/team-temp.svg',
//       members: [
//         {
//           id: 1,
//           name: '멤버1',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: true,
//         },
//         {
//           id: 2,
//           name: '멤버2',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 3,
//           name: '멤버3',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 4,
//           name: '멤버4',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 5,
//           name: '멤버5',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//       ],
//     },
//     {
//       id: 4,
//       name: '팀4',
//       song: '노래4',
//       isEnd: false,
//       endDate: '',
//       myPosition: {
//         position: '포지션4',
//         color: '#0085FF',
//       },
//       teamImg: 'svgs/team-temp.svg',
//       members: [
//         {
//           id: 1,
//           name: '멤버1',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: true,
//         },
//         {
//           id: 2,
//           name: '멤버2',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 3,
//           name: '멤버3',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 4,
//           name: '멤버4',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//       ],
//     },
//     {
//       id: 6,
//       name: '팀6',
//       song: '노래6',
//       isEnd: true,
//       endDate: '2024-04-25',
//       myPosition: {
//         position: '포지션4',
//         color: '#0085FF',
//       },
//       teamImg: 'svgs/team-temp.svg',
//       members: [
//         {
//           id: 1,
//           name: '멤버1',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: true,
//         },
//         {
//           id: 2,
//           name: '멤버2',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 3,
//           name: '멤버3',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 4,
//           name: '멤버4',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 5,
//           name: '멤버5',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//       ],
//     },
//     {
//       id: 7,
//       name: '팀7',
//       song: '노래7',
//       isEnd: true,
//       endDate: '2024-04-24',
//       myPosition: {
//         position: '포지션3',
//         color: '#FF0000',
//       },
//       teamImg: 'svgs/team-temp.svg',
//       members: [
//         {
//           id: 1,
//           name: '멤버1',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: true,
//         },
//         {
//           id: 2,
//           name: '멤버2',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 3,
//           name: '멤버3',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 4,
//           name: '멤버4',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//         {
//           id: 5,
//           name: '멤버5',
//           profileImg: 'svgs/profile-temp.svg',
//           isLeader: false,
//         },
//       ],
//     },
//   ];
//   // setTimeout(() => {
//   // }, 1000);
//   return teams;
// }

export async function getMyTeams() {
  const response = await APIModule({
    action: '/team/total',
    method: 'GET',
    data: null,
  });

  return response;
}
