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


// 피드백 관련 API

export async function getFeedbacks(recordId: number) {
    const response = await APIModule({
        action: `/feedbacks/${recordId}`,
        method: 'GET',
        data: null,
    });
    
    return response;
}

export async function postFeedback(teamId: string, recordId: number, content: string) {
    const data = { content }

    const response = await APIModule({
        action: `/feedbacks/${teamId}/${recordId}`,
        method: 'POST',
        data: data,
    });

    return response;
}

export async function deleteFeedback(feedbackId: number) {
    const response = await APIModule({
        action: `/feedbacks/${feedbackId}`,
        method: 'DELETE',
        data: null,
    });

    return response;
}

export async function putFeedback(feedbackId: number, content: string) {
    const data = { content }

    const response = await APIModule({
        action: `/feedbacks/${feedbackId}`,
        method: 'PUT',
        data: data,
    });

    return response;
}