import Navbar from "@/components/Navbar";

export default function Address(props) {
  return (
    <div>
      <Navbar />
      <div className="bg-white pb-8 sm:pb-12 lg:pb-12">
        <div className="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-24">
          <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
            <div>
              <div className="">
                <div className="mt-6 sm:max-w-xl">
                  <h1 className="text-3xl font-extrabold break-words">
                    {props.address}
                  </h1>
                  <p className="mt-6 text-lg text-gray-500">
                    Find out how crazy you are based on your participation in
                    the Terra ecosystem.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:mx-auto sm:max-w-3xl sm:px-6">
            <div className="py-12 sm:relative sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <div className="relative">
                <div>
                  <div className="mx-auto text-center">
                    <span className="rounded bg-indigo-50 px-4 py-2 text-3xl font-semibold text-indigo-600 tracking-wide uppercase">
                      {props.score}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const address = params.address;
  function searchAddress(entry) {
    return entry.ADDRESS == params.address;
  }
  async function getAmountScore(r) {
    const amountData = await r.json();
    if (amountData.filter(searchAddress).length > 0) {
      return amountData.filter(searchAddress)[0]["AMOUNT"];
    } else {
      return 0;
    }
  }
  async function getCountScore(r) {
    const countData = await r.json();
    if (countData.filter(searchAddress).length > 0) {
      return countData.filter(searchAddress)[0]["COUNT"];
    } else {
      return 0;
    }
  }
  const [
    lunaStakedAmount,
    anchorUstDepositCounts,
    anchorAncStakingCounts,
    terraVotesCounts,
    pylonPoolDepositCounts,
  ] = await Promise.all([
    fetch(
      `https://api.flipsidecrypto.com/api/v2/queries/663f6b3b-d6c8-4957-ba9c-ed5a74ab717d/data/latest`
    ).then((r) => getAmountScore(r)),
    fetch(
      `https://api.flipsidecrypto.com/api/v2/queries/93247971-5bcd-43c4-9542-095f8a12db1e/data/latest`
    ).then((r) => getCountScore(r)),
    fetch(
      `https://api.flipsidecrypto.com/api/v2/queries/d9120881-c198-4339-bf9c-682a47059d6f/data/latest`
    ).then((r) => getCountScore(r)),
    fetch(
      `https://api.flipsidecrypto.com/api/v2/queries/f0cf0d93-d5a9-4f0f-be17-ba2e37f5a4e3/data/latest`
    ).then((r) => getCountScore(r)),
    fetch(
      `https://api.flipsidecrypto.com/api/v2/queries/87724d52-076b-4e1a-98ef-8cd5db303ded/data/latest`
    ).then((r) => getCountScore(r)),
  ]);

  const score = Math.round(
    lunaStakedAmount +
      anchorUstDepositCounts +
      anchorAncStakingCounts +
      terraVotesCounts +
      pylonPoolDepositCounts
  );
  return {
    props: {
      address,
      lunaStakedAmount,
      anchorUstDepositCounts,
      anchorAncStakingCounts,
      terraVotesCounts,
      pylonPoolDepositCounts,
      score,
    },
    revalidate: 60 * 5,
  };
}
export async function getStaticPaths() {
  // Render a major list of 1000 addresses first (from LUNA stakers)
  // Then render any other ones requested at runtime
  const lunaStakers = await fetch(
    `https://api.flipsidecrypto.com/api/v2/queries/663f6b3b-d6c8-4957-ba9c-ed5a74ab717d/data/latest`
  ).then((r) => r.json());
  const paths = lunaStakers.slice(0, 1000).map((entry) => ({
    params: { address: entry.ADDRESS },
  }));

  return { paths, fallback: "blocking" };
}
