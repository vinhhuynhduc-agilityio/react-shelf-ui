// types
import { UserBook } from "@/types";

// services
import { API_BASE_URL } from "@/services";

// helpers
import { apiRequest } from "@/helpers";

// constants
import { API_ENDPOINTS } from "@/constants";

export const getFavourites = (userId: string): Promise<UserBook[]> => {
  const url = `${API_BASE_URL}${API_ENDPOINTS.FAVOURITES}?userId=${userId}`;

  return apiRequest<undefined, UserBook[]>("GET", url);
};

export const addFavouriteItem = async (item: UserBook) => {
  return apiRequest<UserBook, UserBook>(
    "POST",
    `${API_BASE_URL}${API_ENDPOINTS.FAVOURITES}`,
    item
  );
};

export const removeFavouriteItem = async (item: UserBook) => {
  return apiRequest<undefined, void>(
    "DELETE",
    `${API_BASE_URL}${API_ENDPOINTS.FAVOURITES}/${item.id}`
  );
};
