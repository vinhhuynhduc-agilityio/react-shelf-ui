// types
import { FavouriteItem } from "@/types";

// services
import { API_BASE_URL, apiRequest } from "@/services";

// constants
import { API_ENDPOINTS } from "@/constants";

export const getFavourites = (userId: string): Promise<FavouriteItem[]> => {
  const url = `${API_BASE_URL}${API_ENDPOINTS.FAVOURITES}?userId=${userId}`;

  return apiRequest<undefined, FavouriteItem[]>("GET", url);
};

export const addFavouriteItem = async (item: FavouriteItem) => {
  return apiRequest<FavouriteItem, FavouriteItem>(
    "POST",
    `${API_BASE_URL}${API_ENDPOINTS.FAVOURITES}`,
    item
  );
};

export const removeFavouriteItem = async (item: FavouriteItem) => {
  return apiRequest<undefined, void>(
    "DELETE",
    `${API_BASE_URL}${API_ENDPOINTS.FAVOURITES}/${item.id}`
  );
};
