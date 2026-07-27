import { Link } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";

const dummySuggest = [
  {
    name: "Ekozzi",
    mutual: 4,
    picture: "/images/person1.avif",
  },
  {
    name: "Rafa",
    mutual: 4,
    picture: "/images/person2.avif",
  },
  {
    name: "Bambang",
    mutual: 4,
    picture: "/images/person3.avif",
  },
];

export default function SuggestedSection() {
  return (
    <Card className="bg-brand text-white">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Link className="text-highlight2" />
          <h1 className="text-lg">Suggested for you</h1>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {dummySuggest.map((suggest, idx) => (
          <div className="flex items-center justify-between" key={idx}>
            <div className="flex items-center space-x-4">
              <Image
                src={suggest.picture}
                width={35}
                height={35}
                alt="prof"
                className="rounded-full"
              />
              <div>
                <p className="text-lg">{suggest.name}</p>
                <p className="opacity-50 text-xs">
                  {suggest.mutual} mutual friends
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              className="bg-brand5 text-white font-bold cursor-pointer"
            >
              Follow
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
