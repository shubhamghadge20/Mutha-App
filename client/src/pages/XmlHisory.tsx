import XmlHistoryMaster from "@/components/XmlHistory/XmlHistoryMaster";
import XmlComparisonDetails from "@/components/XmlHistory/XmlComparisonDetails";

const XmlHistoryPage = () => {
  return (
    <div className="p-4">
      <XmlHistoryMaster />
      <XmlComparisonDetails />
    </div>
  );
};

export default XmlHistoryPage;
