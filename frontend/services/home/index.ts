import APIModule from "@/utils/apiModule";

export async function getMainTeams() {
  const response = await APIModule({
    action: `/team/active`,
    method: "GET",
    data: null,
  });

  return response;
}


export async function getMainRecords() {
  const response = await APIModule({
    action: `/records/my`,
    method: "GET",
    data: null,
  });

  return response;
}
