import APIModule from "@/utils/apiModule";

export async function getLogout() {
    const response = await APIModule({
      action: "/users/logout",
      method: "GET",
      data: null,
    });
  
    return response;
  }