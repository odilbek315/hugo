const API_URL = "http://localhost:5000";
document.getElementById("apiUrlLabel").innerText = API_URL;

async function parseResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Xatolik yuz berdi");
  }
  return data;
}

document.getElementById("verifyForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const propertyId = document.getElementById("verifyPropertyId").value.trim();
  const ownerAddress = document.getElementById("verifyOwnerAddress").value.trim();

  try {
    const response = await fetch(`${API_URL}/property/${propertyId}/verify/${ownerAddress}`);
    const data = await parseResponse(response);
    document.getElementById("verifyResult").innerText = data.isOwner
      ? "Bu manzil mulk egasi."
      : "Bu manzil mulk egasi emas.";
  } catch (error) {
    document.getElementById("verifyResult").innerText = `Xatolik: ${error.message}`;
  }
});

document.getElementById("historyForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const propertyId = document.getElementById("historyPropertyId").value.trim();

  try {
    const response = await fetch(`${API_URL}/property/${propertyId}/history`);
    const data = await parseResponse(response);
    document.getElementById("historyResult").innerText = JSON.stringify(data.history, null, 2);
  } catch (error) {
    document.getElementById("historyResult").innerText = `Xatolik: ${error.message}`;
  }
});
