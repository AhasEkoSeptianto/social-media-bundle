import Image from "next/image";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { ChevronRight, TrendingUp } from "lucide-react";

const trendingDummby = [
  {
    search: "#goldenhour",
    total_post: "40k post",
  },
  {
    search: "#studiosetup",
    total_post: "30k post",
  },
  {
    search: "#sundaybunch",
    total_post: "30k post",
  },
  {
    search: "#streetphoto",
    total_post: "20k post",
  },
];

export default function TrendingSection() {
  return (
    <Card className="bg-brand text-white">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <TrendingUp className="text-highlight2" />
          <h1 className="text-lg">Trending</h1>
        </div>
      </CardHeader>
      <CardContent>
        {trendingDummby.map((trend, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between  hover:bg-brand2 rounded-lg p-2 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <p className="text-highlight2 text-sm">{idx + 1}</p>
              <div>
                <p className="text-lg">{trend.search}</p>
                <p className="text-highlight2">{trend.total_post}</p>
              </div>
            </div>
            <ChevronRight />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
