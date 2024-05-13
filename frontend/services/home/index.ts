import APIModule from "@/utils/apiModule";

export async function getMainTeams() {
  const response = await APIModule({
    action: `/team/active`,
    method: "GET",
    data: null,
  });

  return response;
}



// export async function getMainTeams() {
//   const teams = [
//     {
//       id: 1,
//       name: '팀1',
//       song: '노래1',
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
//   ];
//   // setTimeout(() => {
//   // }, 1000);
//   return teams;
// }

export async function getMainRecords() {
  const records = [
    {
      id: 1,
      teamImage: 'svgs/team-temp.svg',
      songName: '노래1',
      position: {
        name: '포지션1',
        color: '#0085FF',
      },
      title: '처음부터 끝까지',
      runTime: 211,
      dateTime: {
        date: '2024. 04. 27',
        time: '12:00',
      },
    },
    {
      id: 2,
      teamImage: 'svgs/team-temp.svg',
      songName: '노래2',
      position: {
        name: '포지션2',
        color: '#ff9314',
      },
      title: '마지막 파트만',
      runTime: 31,
      dateTime: {
        date: '2024. 04. 25',
        time: '15:00',
      },
    },
    {
      id: 3,
      teamImage: 'svgs/team-temp.svg',
      songName: '노래1',
      position: {
        name: '포지션1',
        color: '#0085FF',
      },
      title: '첫 번째 곡만',
      runTime: 138,
      dateTime: {
        date: '2024. 04. 24',
        time: '10:30',
      },
    },
  ];
  return records;
}
