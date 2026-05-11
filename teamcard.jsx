import "./Team.css";

const TeamCard = ({ name, role, image }) => {
  return (
    <div className="team-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  );
};

export default TeamCard;
