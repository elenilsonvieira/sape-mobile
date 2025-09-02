import React from "react";
import UserComponent, { User } from "./UserComponent";

type UserCardProps = {
  user: User;
};

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return <UserComponent user={user} />;
};

export default UserCard;