import APIModule from "@/utils/apiModule";

export async function getTeamRecordsAll(teamId: string) {
    const response = await APIModule({
        action: `/records/team/${teamId}?filter=all`,
        method: 'GET',
        data: null,
    });
    
    return response;
}

export async function getTeamRecordsMy(teamId: string) {
    const response = await APIModule({
        action: `/records/team/${teamId}?filter=my`,
        method: 'GET',
        data: null,
    });
    
    return response;
}

export async function getTeamRecordsFiltered(teamId: string, positionId: number) {
    const response = await APIModule({
        action: `/records/team/${teamId}?filter=pos${positionId}`,
        method: 'GET',
        data: null,
    });
    
    return response;
}