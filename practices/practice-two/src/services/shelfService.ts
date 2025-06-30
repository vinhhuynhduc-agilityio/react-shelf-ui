// constant
import { API_ENDPOINTS } from "@/constants";

// services
import { apiRequest } from "./apiRequest";

// config
import { API_BASE_URL } from "@/config";

// types
import { ShelfItem } from "@/types";

export const getShelves = (userId: string): Promise<ShelfItem[]> => {
	const url = `${API_BASE_URL}${API_ENDPOINTS.SHELVES}?userId=${userId}`;
	return apiRequest<undefined, ShelfItem[]>("GET", url);
};

export const addShelfItem = async (shelfItem: ShelfItem) => {
	return apiRequest<ShelfItem, ShelfItem>(
		"POST",
		`${API_BASE_URL}${API_ENDPOINTS.SHELVES}`,
		shelfItem
	);
};

export const removeShelfItem = async (shelfItem: ShelfItem) => {
	return apiRequest<undefined, void>(
		"DELETE",
		`${API_BASE_URL}${API_ENDPOINTS.SHELVES}/${shelfItem.id}`
	);
};
