import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import firebaseGetUserBySlug from "../../../utils/firebaseGetUserBySlug";

import Wall from "./wall";

const Profile = () => {
  const params: { slug: string } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    firebaseGetUserBySlug(params.slug)
      .then((res) => {
        // console.log(res);
        setProfile(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params.slug]);

  const Main = () => {
    if (loading) {
      return <div>Loading</div>;
    } else if (!loading && !profile) {
      return <div>No profile found</div>;
    } else {
      return <ProfileContent />;
    }
  };

  const ProfileContent = () => {
    return (
      <div>
        {profile.avatar && (
          <img src={profile.avatar} className="w-50 mb-3" alt="profile" />
        )}
        <h1>{profile.username} Profile</h1>
        <Wall profile={profile} />
      </div>
    );
  };

  return (
    <div className="text-center container py-4">
      <Main />
    </div>
  );
};

export default Profile;
