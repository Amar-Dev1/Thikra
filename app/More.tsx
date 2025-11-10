import BgWrapper from "@/components/BgWrapper";
import ScreenTitle from "@/components/ScreenTitle";
import { RightAngleSvg } from "@/constants/icons";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import discoverCards from "../assets/data/discoverSection.json";
import DiscoverCard from "@/components/DiscoverCard";
import { images } from "@/constants/images";

const More = () => {
  return (
    <BgWrapper className="px-5">
      <ScreenTitle title="المزيد" className="flex-row items-center py-4">
        <TouchableOpacity
          className="absolute left-0 w-10 h-10 flex justify-center items-center bg-light border border-gray-300 rounded-full"
          onPress={router.back}
        >
          <RightAngleSvg width={24} height={24} />
        </TouchableOpacity>
      </ScreenTitle>

      <View className=" mt-5 flex-1 flex-row gap-4 flex-wrap">
        {discoverCards
          .filter((_, index) => index !== discoverCards.length - 1)
          .map((card) => (
            <DiscoverCard
              key={card.id}
              {...card}
              image={(images as any)[card.image]}
              className={`min-w-[47%] flex-1`}
              route={card.route}
            />
          ))}
      </View>
    </BgWrapper>
  );
};

export default More;
