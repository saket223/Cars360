import { fetchCars } from "@utils";
import { fuels, yearsOfProduction } from "@constants";
import { CarCard, ShowMore, SearchBar, CustomFilter, Hero } from "@components";
import { FilterProps, HomeProps } from "@types";

export async function getServerSideProps(context: { query: FilterProps }) {
  const { query } = context;

  // Fetch cars based on the query parameters
  const allCars = await fetchCars({
    manufacturer: query.manufacturer || "",
    year: query.year || 2022,
    fuel: query.fuel || "",
    limit: query.limit || 10,
    model: query.model || "",
  });

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1;

  return {
    props: {
      allCars,
      isDataEmpty,
      searchParams: query, // passing the searchParams as props
    },
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const allCars = await fetchCars({
    manufacturer: searchParams.manufacturer || "",
    year: searchParams.year || 2022,
    fuel: searchParams.fuel || "",
    limit: searchParams.limit || 10,
    model: searchParams.model || "",
  });

  // Type guard for allCars to check if it's an array
  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1;

  // Check if it's an error object
  const isError =
    !Array.isArray(allCars) && (allCars as { message: string }).message;

  return (
    <main className="overflow-hidden">
      <Hero />

      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore our cars you might like</p>
        </div>

        <div className="home__filters">
          <SearchBar />

          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} />
            <CustomFilter title="year" options={yearsOfProduction} />
          </div>
        </div>

        {!isDataEmpty && !isError ? (
          <section>
            <div className="home__cars-wrapper">
              {allCars.map((car, index) => (
                <CarCard key={index} car={car} />
              ))}
            </div>

            <ShowMore
              pageNumber={(searchParams.limit || 10) / 10}
              isNext={(searchParams.limit || 10) > allCars.length}
            />
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">Oops, no results</h2>
            <p>
              {isError
                ? (allCars as { message: string }).message
                : "No cars found matching your criteria."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
