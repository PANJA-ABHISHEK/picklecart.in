"use server";
import { getLocations, seedInitialLocation, updateLocation, createLocation, deleteLocation } from "@/services/locations";

export async function fetchLocations() {
  const locations = await getLocations();
  if (locations.length === 0) {
    return await seedInitialLocation();
  }
  return locations;
}


export async function saveLocation(id, data) {
  if (id) {
    return await updateLocation(id, data);
  } else {
    return await createLocation(data);
  }
}

export async function removeLocation(id) {
  return await deleteLocation(id);
}
