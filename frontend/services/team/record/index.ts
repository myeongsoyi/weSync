export async function getTeamRecordPositions() {
    const positions = [
        {
            id: 1,
            name: '테너',
            color: 'red',
        },
        {
            id: 2,
            name: '베이스',
            color: 'blue',
        },
        {
            id: 3,
            name: '퍼커션',
            color: 'green',
        },
        {
            id: 4,
            name: '알토',
            color: 'hotpink',
        },
        {
            id: 5,
            name: '소프라노',
            color: 'purple',
        },
        {
            id: 6,
            name: null,
            color: null,
        },
    ];
    return positions;
}

export interface IRecord {
    id: number;
    name: string|null;
    color: string|null;
}
