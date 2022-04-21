import ContestantTable from './ContestantTable';

export default function ClientScorecard({ categories, contestants }) {

  // component
  return (
    <div className="tv-clientScorecard">
      <ContestantTable categories={categories} contestants={contestants} />
    </div>
  );
}
