import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

export default function DescriptionCard(props: any) {
  const { relayHash } = props;

  return (
    <Card
      shadow="sm"
      isPressable
      className="rounded-xl text-card-foreground shadow-sm w-full lg:w-80 h-[230px] xl:h-[205px] bg-opacity-10 bg-white bg-[#404040] backdrop-blur-lg border-0 fade-animation rounded-[20px] mr-4"
    >
      <CardHeader>
        <div className="text-[24px] text-[#c6cad6] p-3 text-left w-full">
          Subscribe to {relayHash}
        </div>
      </CardHeader>
    </Card>
  );
}
