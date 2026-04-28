import SEO from '../components/seo/SEO';
import ReviewsSection from '../components/sections/ReviewsSection';
import CTABanner from '../components/sections/CTABanner';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Eric Faulk',
    text: "We scheduled a trip months in advance. The day before our trip the captain called and suggested the weather would be too rough and offered us the opportunity to back out. We really wanted to go so the captain agreed to wait till morning to make the call. He met us at the boat at 5am and told us we wouldn't be going. While disappointed we appreciated the willingness to reschedule or refund instead of taking our money for a trip that was doomed to fail. We got a full refund without hassle and are looking for an opportunity to try again. Our next trip will be on the Wahoo!",
    stars: 5,
  },
  {
    name: 'Steven Ginesi',
    text: "This crew is dedicated to fishing. That showed all day. Had such a good trip!! Caught and caught! Got us on Da meat baby!! Will be back soon! Thanks!!!!",
    stars: 5,
  },
  {
    name: 'Joseph Shagen',
    text: "Excellent trip. Good catch. Highly recommend.",
    stars: 5,
  },
  {
    name: 'Tom Oswald',
    text: "We chartered the Wahoo on 7/22/22. We had a phenomenal trip. Drew and Dillon made the fishing trip well worth it. We will be back again.",
    stars: 5,
  },
  {
    name: 'Robert Ashbaugh',
    text: "What a fantastic fishing trip. I took my 3 adult sons and three grandsons one 13 years old and two 16 years old. Captain Jamie and his mates Cole and Chase did a fantastic job. We caught grouper, vermilion, amberjack, barracuda, sharks and red snapper. It was an all day trip and we all were exhausted from catching so many fish! Can't wait to go again.",
    stars: 5,
  },
  {
    name: 'Michele Casteel',
    text: "Full day trip with the family. Captain Jaime and Cole were awesome. Caught so many fish and the guys made the entire experience great. Their excitement over fishing is contagious. Had quite a few beginners and they were super patient and made sure everyone had a good time. Can't wait to do it again.",
    stars: 5,
  },
  {
    name: 'Samuel Curtis',
    text: "Had a great time with these guys. Went out caught 15 Mahi! Deck hand and the captain were awesome. Highly recommend.",
    stars: 5,
  },
  {
    name: 'John Sipe',
    text: "The Git R Done crew is the hardest working team out there. Capt Chris is relentless and knows how to find the fish. First mate Dave works non stop to make sure that baits are fresh and rigs are ready and he makes sure that you'll have a great time on the water! Their teamwork is impressive to watch.",
    stars: 5,
  },
  {
    name: 'David Adams',
    text: "Had a great fishing experience on the Teaser II. We had 15 people we took with Caption Jamie and crew of Chase and Cole. Talk about taking care or the customer is just what this crew did. Was a little concerned about the quantity of people going but Caption Jamie said it was no problem and all would have a great time. And we did. Thank you sir and your crew for an awesome day, we will be back.",
    stars: 5,
  },
  {
    name: 'Kelly Pipkin',
    text: "Captain Chris exceeded our expectations on Get R Done. The boat was clean and organized. The fishing was fantastic! Lots of high fives after we landed the 50lb yellowfin tuna. Could not ask for a better experience. 10/10",
    stars: 5,
  },
  {
    name: 'Dirkyboys',
    text: "We went out on the Teaser 2 and had an amazing trip. We had a group of 12 with 6 under the age of 11. Captain Jamie and Cole were more than happy to have the youngsters on the boat. They all caught fish and were all able to get up and talk to Captain Jamie as we were coming in and out of the bay. They put us on fish almost immediately and had opportunities to catch some giant ones that unfortunately broke us off. Highly recommend Captain Jamie and Cole!!!!! Great guys. We will be back.",
    stars: 5,
  },
  {
    name: 'George McCurdy',
    text: "My family just went out with Capt Jamie on the Teaser 2. We had a blast. The whole crew did a fantastic job. My wife and I took our 8yr old son and 11yr niece and we all caught plenty of fish. Sea Bass, Snapper, Grouper. Crew did a wonderful job helping the kids manage the bigger fish. Highly recommend for the whole family.",
    stars: 5,
  },
  {
    name: 'Kyle Lagunas',
    text: "We had an epic day on 8/5/20. Caught Wahoo, Dolphin and released a Marlin. Capt. Drew and David were great! They put us on the fish and provided an excellent environment for us to reel them in. Looking forward to the next time. Their favorite swimming spots, and topped it off with fantastic photos and a video of it all. Can't recommend them enough.",
    stars: 5,
  },
  {
    name: 'Matthew Mosseau',
    text: "Excellent! The captain and crew were extremely professional and I am planning on going out with them again.",
    stars: 5,
  },
  {
    name: 'Anonymous',
    text: "Capt. Jamie took good care of us on Teaser 2 - even though we had rough seas, we still found opportunities to fish - Captain watched out for everyone to have a good trip.",
    stars: 5,
  },
  {
    name: 'Blake Crook',
    text: "Excellent day on the water. Great crew and the drone video after the trip is something I will look forward to sharing with others.",
    stars: 5,
  },
  {
    name: 'Jenny Phillips',
    text: "We had a blast fishing with the crew. They put us on fish right out of the gate, kept us baited up and hitting 'em hard. Couldn't have asked for a better charter.",
    stars: 5,
  },
  {
    name: 'John Mcdonnell Jr',
    text: "Best fishing charter in Charleston, SC. Caught several dolphin, one being the biggest I have ever seen!!!! We will be back John. Thanks also to Chris and Nathan for making the trip great!!!",
    stars: 5,
  },
  {
    name: 'Leah Cockerham',
    text: "This was the first time me and my family have been deep sea fishing and we can't wait to do it again! Capt. John and the crew were awesome and we ended up catching more blackfin tuna than we could count! Definitely would recommend The Wahoo and am looking forward to the next trip out.",
    stars: 5,
  },
  {
    name: 'Arlo Gardner',
    text: "Awesome fun! Captain put us on biggest mahi I have ever caught. Excellent crew and accommodations. Can't wait to go back with this charter!",
    stars: 5,
  },
  {
    name: 'Alyssa Zingaro',
    text: "Couldn't have asked for a better fishing experience in Charleston!",
    stars: 5,
  },
  {
    name: 'Cynthia Whitaker',
    text: "Awesome captain and crew!",
    stars: 5,
  },
  {
    name: 'Brent Rivers',
    text: "We had a tough day, but this wasn't the fault of the crew or boat, as a matter of fact, they went above and beyond to try and make sure we had fish. The seas were bouncy and they werent biting, so don't push a trip if it's not the right time to go.",
    stars: 4,
  },
  {
    name: 'Louis DeMarinis',
    text: "They took 4 friends and I out deep-sea, and they nailed it. The captain, owner, and mate were all very helpful, friendly, and truly cared about your experience while on the Wahoo. The owner and captain kept us on the fish all day. The whole boat is accessible, and the crew is willing to teach you anything you want to know about operations and instruments. Oh, and if you are afraid to miss the football game on the weekend, no worries, the boat is equipped with DirecTV and NFL Sunday Ticket. Trip is well worth the money, and I will be heading back out with them ASAP. The owner also puts together a nice little video for the guests showing the highlights of the trip. Did a great job with it too.",
    stars: 5,
  },
  {
    name: 'George Morris',
    text: "One of the best offshore trips in SC I've ever had and believe me I have had plenty of them! These guys were lots of fun, and knew where to go to bring home the bacon! lol I highly recommend this group to anyone!!!",
    stars: 5,
  },
];

export default function Reviews() {
  return (
    <>
      <SEO
        title="Reviews | Fish The Wahoo Charleston Fishing Charters"
        description="Read reviews from anglers who have fished with Fish The Wahoo out of Charleston, SC. 5-star Google and TripAdvisor reviews from real customers."
        canonicalPath="/reviews/"
      />

      <section className="pt-32 pb-8 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label">Customer Reviews</span>
          <h1 className="text-5xl md:text-6xl text-white uppercase mb-6">People Are Talking</h1>
          <div className="section-divider" />
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} className="w-6 h-6 fill-accent-orange text-accent-orange" />
            ))}
            <span className="text-white font-bold ml-2">5.0 / 5</span>
            <span className="text-slate-400 text-sm ml-1">· Verified Google & Facebook reviews</span>
          </div>
        </div>
      </section>

      <ReviewsSection reviews={reviews} showHeader={false} />

      <CTABanner
        headline="Ready to Create Your Own Story?"
        subtext="Pick your date, pick your trip length, and we'll match you with the right Charleston captain. Book your trip today."
        ctaLabel="Book A Trip"
        ctaTo="/book"
      />
    </>
  );
}
