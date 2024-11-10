

export const useCreateProfile = async () => {
    // uploadPicture();

    if (User.CreateProfile === "UPDATE PROFILE" && docId) {
      try {
        await deleteDoc(doc(db, "users", docId));
        console.log(docId, "deleted successfully!")
      }
      catch (e) {
        console.error("Error deleting document: ", e);
      }
    }

    try {
      const docRef = await addDoc(collection(db, "users"), {
        email: User.email || userRef.userEmail,
        displayPicture: userRef.imageUrl || profileImage || "",
        first: User.first,
        last: User.last,
        dob: User.dob,
        gender: User.gender,
        city: User.city,
        phoneNumber: User.phoneNumber,
        CreateProfile: "UPDATE PROFILE"
      });
      if (error) {
        setError("Phone number should be 11 digits");
      } else {
        console.log("Document written with ID: ", docRef.id);
        userupdateProfile();
        User.CreateProfile = "UPDATE PROFILE"
        setDocId(docRef.id);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    
    return useCreateProfile;
  };