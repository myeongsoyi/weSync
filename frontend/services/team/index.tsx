export async function getTeamNotices(teamId: string) {
    const notices = [
        {
            id: 1,
            date: '2021-03-01',
            detail: '1번 연습해오기. 안해올 시 벌금 000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            pinned: true,
        },
        {
            id: 2,
            date: '2021-03-02',
            detail: '2번 연습해오기',
            pinned: false,
        },
        {
            id: 3,
            date: '2021-03-03',
            detail: '3번 연습해오기',
            pinned: false,
        },
        {
            id: 4,
            date: '2021-03-04',
            detail: '4번 연습해오기',
            pinned: false,
        }
    ];
    return notices;
}