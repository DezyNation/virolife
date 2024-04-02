"use client";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  HStack,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  VStack,
  useClipboard,
  useToast,
  InputGroup,
  InputRightAddon,
  Image,
  AvatarBadge,
  Select,
  Spacer,
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import BackendAxios from "@/utils/axios";
import QRCode from "react-qr-code";
import Tree from "react-d3-tree";
import VideoPlayer from "@/components/global/VideoPlayer";
import ChildMemberCard from "@/components/dashboard/ChildMemberCard";
import VerticalSpacer from "@/components/global/VerticalSpacer";
import Cookies from "js-cookie";
import useRazorpay from "@/utils/hooks/useRazorpay";
import useApiHandler from "@/utils/hooks/useApiHandler";

const MyParents = ({ parents, myParentId, groupType }) => {
  const Toast = useToast({ position: "top-right" });
  const { handleError } = useApiHandler();

  const [showDonateBtn, setShowDonateBtn] = useState(false);

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [parentUsers, setParentUsers] = useState(parents);

  const [qrModal, setQrModal] = useState(false);
  const [upi, setUpi] = useState("");
  const [amount, setAmount] = useState(200);
  const [receiver, setReceiver] = useState({
    id: "",
    name: "",
  });

  const [myCurrentRound, setMyCurrentRound] = useState(null);
  const [requirements, setRequirements] = useState({
    threshold: 0,
    collection: 0,
  });
  const [myUserId, setMyUserId] = useState("");

  const [videoStatus, setVideoStatus] = useState(false);
  const [videoData, setVideoData] = useState({
    title: "Watch this video to proceed.",
    id: "",
    provider: "",
    onVideoClose: () => {
      return null;
    },
  });

  useEffect(() => {
    setMyCurrentRound(localStorage.getItem("currentRound"));
    setMyUserId(localStorage.getItem("userId"));
    fetchMyCollection();
  }, []);

  useEffect(() => {
    if (myUserId) {
      fetchMyDonations();
      fetchRounds();
    }
  }, [myCurrentRound, myUserId]);

  useEffect(() => {
    const onHold = parseInt(localStorage.getItem("onHold")) === 1;
    if (parseInt(amount) > 0 && !onHold) {
      setShowDonateBtn(true);
    } else {
      setShowDonateBtn(false);
    }
  }, [amount]);

  function showVideo(user, key) {
    setVideoStatus(true);
    setVideoData({
      ...videoData,
      onVideoClose: () => {
        setVideoStatus(false);
        showUpiModal(user, key);
      },
    });
  }

  function showUpiModal(user, key) {
    if (groupType == "primary" && !user?.primary_activated) {
      setUpi("9022853554@okbizaxis");
      setReceiver({
        id: user?.id,
        name: "Virolife Foundation",
      });
      setQrModal(true);
      return;
    }
    if (groupType == "secondary" && !user?.secondary_activated) {
      setUpi("9022853554@okbizaxis");
      setReceiver({
        id: user?.id,
        name: "Virolife Foundation",
      });
      setQrModal(true);
      return;
    }
    if (!user?.upi_id) {
      setUpi("9022853554@okbizaxis");
      setReceiver({
        id: user?.id,
        name: "Virolife Foundation",
      });
      setQrModal(true);
      return;
    }
    setUpi(user?.upi_id);
    setReceiver({
      id: user?.id,
      name: user?.parent_name,
    });
    setQrModal(true);
  }

  function donate() {
    BackendAxios.post(
      receiver?.name == "Virolife Foundation"
        ? `/api/donate/admin`
        : `/api/donation`,
      {
        donatable_id: receiver?.id,
        amount: amount,
        remarks: `Donation to ${groupType} group senior  VCF${receiver.id}`,
        group: groupType,
      }
    )
      .then((res) => {
        fetchMyDonations();
        Toast({
          status: "success",
          description: "Notification sent to senior",
        });
        setQrModal(false);
        setTimeout(() => {
          window.location.reload(true);
        }, 300);
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          Cookies.remove("jwt");
          localStorage.clear();
          window.location.assign("/");
          return;
        }
        setQrModal(false);
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function fetchMyDonations() {
    BackendAxios.get(`/api/senior-donations/${myUserId}/${myCurrentRound}`)
      .then((res) => {
        setBeneficiaries(
          res.data
            ?.filter((item) => item?.group == groupType)
            ?.map((item) => item?.donatable_id)
        );
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          Cookies.remove("jwt");
          localStorage.clear();
          window.location.assign("/");
          return;
        }
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  async function fetchMyCollection() {
    await BackendAxios.get(`/api/total-donation`)
      .then((res) => {
        setRequirements((prev) => ({
          ...prev,
          collection:
            parseInt(res.data?.primary) + parseInt(res.data?.secondary),
        }));
      })
      .catch((err) => {
        handleError(err, "Error while fetching total collection");
      });
  }

  function fetchRounds(round = myCurrentRound) {
    BackendAxios.get(`/api/tasks`)
      .then((res) => {
        const tasks = res.data;
        const currentTasks = tasks?.find(
          (task) => task?.round == myCurrentRound
        );

        console.log("My current round is ", myCurrentRound);
        console.log("Tasks are");
        console.log(currentTasks);

        setRequirements((prev) => ({
          ...prev,
          threshold: Number(currentTasks?.target_amount)?.toFixed(0),
          primarySeniorAmount: Number(
            currentTasks?.primary_senior_amount
          )?.toFixed(0),
          secondarySeniorAmount: Number(
            currentTasks?.secondary_senior_amount
          )?.toFixed(0),
        }));

        if (groupType == "primary") {
          if (Number(currentTasks?.primary_senior_amount) == 0) {
            setShowDonateBtn(false);
          }
          setAmount(Number(currentTasks?.primary_senior_amount));
        }
        if (groupType == "secondary") {
          if (Number(currentTasks?.secondary_senior_amount) == 0) {
            setShowDonateBtn(false);
          }
          setAmount(Number(currentTasks?.secondary_senior_amount));
        }
      })
      .catch((err) => {
        console.log("error while fetching tasks");
        console.log(err?.response?.data);
      });
  }

  useEffect(() => {
    if (parents?.length) {
      let newData = [...parents];
      newData[0].id = parseInt(myParentId);
      setParentUsers(newData);
    }
  }, [parents]);

  return (
    <>
      <Box>
        {parentUsers?.map((item, key) => (
          <HStack
            py={4}
            key={key}
            w={["full", "xs"]}
            justifyContent={"space-between"}
          >
            <HStack>
              <Avatar name={item?.parent_name}>
                <AvatarBadge
                  boxSize="1.25em"
                  bg="yellow.500"
                  children={<Text fontSize="12px">{key + 1}</Text>}
                />
              </Avatar>
              <Box>
                <Text className="serif" fontWeight={"semibold"} fontSize={"lg"}>
                  {item?.parent_name}
                </Text>
                <Text fontSize={"xs"}>
                  ID: {process.env.NEXT_PUBLIC_CODE}
                  {key == 0 ? myParentId : item?.id}
                  {/* &nbsp; | &nbsp; Phone:{" "}
                  {item?.parent_phone} */}
                </Text>
              </Box>
            </HStack>
            {beneficiaries?.includes(item?.id) ? (
              <Text color="whatsapp.500">Donated</Text>
            ) : myCurrentRound > 0 &&
              requirements.collection <
                requirements.threshold ? null : showDonateBtn ? (
              <Button
                size={"xs"}
                colorScheme="yellow"
                onClick={() => {
                  showVideo(item, key);
                }}
              >
                {amount ? `₹${amount}` : "Donate"}
              </Button>
            ) : null}
          </HStack>
        ))}
      </Box>

      <Modal size={"xs"} isOpen={qrModal} onClose={() => setQrModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Donate ₹{amount} to {receiver.name}
          </ModalHeader>
          <ModalBody alignItems={"center"} justifyContent={"center"}>
            <QRCode
              size={256}
              value={`upi://pay?cu=INR&pa=${upi}&am=${
                groupType == "primary"
                  ? requirements?.primarySeniorAmount
                  : requirements?.secondarySeniorAmount
              }`}
            />
            <br />
            <Text textAlign={"center"}>Pay with any UPI app</Text>
            <Image
              w={"80%"}
              src={"https://mytechtrips.com/wp-content/uploads/2023/01/upi.png"}
              objectFit={"contain"}
              mx={"auto"}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="yellow"
              rounded={"full"}
              onClick={() => donate(receiver.id)}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {videoStatus ? (
        <VideoPlayer
          status={videoStatus}
          title={videoData.title}
          onVideoClose={videoData.onVideoClose}
        />
      ) : null}
    </>
  );
};

const NestedChildren = ({
  data,
  donors,
  level,
  currentLevel = 1,
  groupType,
  completeList,
}) => {
  if (parseInt(currentLevel) == parseInt(level)) {
    return (
      <>
        {data.map((item, key) => (
          <ChildMemberCard
            key={key}
            name={item?.name}
            id={item?.id}
            phone_number={item?.phone_number}
            donation_received={donors?.includes(item?.id)}
            canAcceptDonation={completeList
              ?.slice(0, 20)
              ?.filter((usr) => ({ id: usr?.id }))
              ?.includes(item?.id)}
            groupType={groupType}
            upi_id={item?.upi_id}
          />
        ))}
      </>
    );
  }

  return (
    <ul>
      {data.map((item) => (
        <li key={item.id} style={{ listStyle: "none" }}>
          {item.children && (
            <NestedChildren
              data={item.children}
              level={level}
              currentLevel={currentLevel + 1}
              completeList={completeList}
              donors={donors}
              groupType={groupType}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

const MyChildren = ({ childMembers, donors, groupType }) => {
  const Toast = useToast({ position: "top-right" });
  const [groupModal, setGroupModal] = useState(false);
  const [myId, setMyId] = useState("");

  const [myGroup, setMyGroup] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  const [selectedLevel, setSelectedLevel] = useState("1");

  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState({
    status: false,
    id: "",
    donation: "0",
  });

  useEffect(() => {
    const handleWindowMouseMove = (event) => {
      setCoords({
        x: event.clientX,
        y: event.clientY,
      });
    };
    window.addEventListener("mousemove", handleWindowMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
    };
  }, []);

  useEffect(() => {
    setMyId(localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    loadGroup();
  }, []);

  function buildHierarchy(items, parentId) {
    const nestedArray = [];
    for (const item of items) {
      if (parseInt(item.parent_id) == parseInt(parentId)) {
        const children = buildHierarchy(items, item.id);
        if (children.length > 0) {
          item.children = children;
        }
        nestedArray.push(item);
      }
    }
    return nestedArray;
  }

  function viewGroup(id) {
    if (!myGroup?.length) {
      Toast({
        description: "Group doesn't exist!",
      });
      return;
    }
    setGroupModal(true);
  }

  function loadGroup() {
    BackendAxios.get(`/api/my-group`)
      .then((res) => {
        setMyGroup(res.data);
        const hierarchyArray = buildHierarchy(
          res.data,
          localStorage.getItem("userId")
        );
        setGroupMembers([
          {
            name: localStorage.getItem("userName"),
            children: hierarchyArray,
            id: localStorage.getItem("userId"),
            donation: 0,
          },
        ]);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function fetchCollection(id) {
    BackendAxios.get(`/api/users/${id}`)
      .then((res) => {
        if (groupType == "primary") {
          setShowTooltip({
            status: true,
            id: `VCF${id}`,
            donation:
              Number(res?.data?.primary_sum || 0) +
              Number(res?.data?.senior_primary || 0),
          });
        }
        if (groupType == "secondary") {
          setShowTooltip({
            status: true,
            id: `VCF${id}`,
            donation:
              Number(res?.data?.secondary_sum || 0) +
              Number(res?.data?.senior_secondary || 0),
          });
        }
      })
      .catch((err) => {
        console.log("Error in Fetching Collection");
        console.log(err);
      });
  }

  return (
    <>
      <Box>
        <HStack w={"full"} justifyContent={"space-between"}>
          <Text fontSize={"xl"}>My Juniors (Primary ID)</Text>
          <Select width={28} onChange={(e) => setSelectedLevel(e.target.value)}>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
            <option value="5">Level 5</option>
            <option value="6">Level 6</option>
            <option value="7">Level 7</option>
            <option value="8">Level 8</option>
            <option value="9">Level 9</option>
            <option value="10">Level 10</option>
          </Select>
        </HStack>
        <br />
        <NestedChildren
          level={selectedLevel}
          data={groupMembers[0]?.children || []}
          donors={donors}
          completeList={donors}
          groupType={"primary"}
        />
        {myGroup?.filter((user) => user?.parent_id == parseInt(myId))
          ?.length ? (
          <HStack justifyContent={"flex-end"} py={4}>
            <Button
              size={"sm"}
              rounded={"full"}
              colorScheme="yellow"
              onClick={() => viewGroup()}
            >
              View Group Tree
            </Button>
          </HStack>
        ) : null}
      </Box>

      <Modal
        isOpen={groupModal}
        onClose={() => setGroupModal(false)}
        size={["full", "4xl"]}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>You Group Members</ModalHeader>
          <ModalBody>
            <Box w={"full"} h={"80vh"} pos={"relative"}>
              <Tree
                data={groupMembers}
                orientation="vertical"
                translate={{ x: 300, y: 200 }}
                separation={{ siblings: 3, nonSiblings: 3 }}
                onNodeMouseOver={(data) => fetchCollection(data?.data?.id)}
                onNodeMouseOut={() => setShowTooltip({ status: false })}
              />
            </Box>
            <Box
              display={showTooltip.status ? "flex" : "none"}
              flexDirection={"column"}
              pos={"absolute"}
              top={coords.y - 100}
              left={coords.x - 400}
              p={3}
              rounded={4}
              boxShadow={"sm"}
              bgColor={"#FFF"}
            >
              <Text fontSize={"sm"}>ID: {showTooltip.id}</Text>
            </Box>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const MySecondaryChildren = ({ childMembers, donors }) => {
  const Toast = useToast({ position: "top-right" });
  const [groupModal, setGroupModal] = useState(false);
  const [myId, setMyId] = useState("");
  const [myName, setMyName] = useState("");
  const [myGroup, setMyGroup] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState({
    status: false,
    id: "",
    donation: "0",
  });

  const [selectedLevel, setSelectedLevel] = useState("1");

  useEffect(() => {
    const handleWindowMouseMove = (event) => {
      setCoords({
        x: event.clientX,
        y: event.clientY,
      });
    };
    window.addEventListener("mousemove", handleWindowMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
    };
  }, []);

  useEffect(() => {
    setMyId(localStorage.getItem("userId"));
    setMyName(localStorage.getItem("userName"));
  }, []);

  useEffect(() => {
    loadGroup();
  }, []);

  function buildHierarchy(items, parentId) {
    const nestedArray = [];
    for (const item of items) {
      if (parseInt(item.secondary_parent_id) == parseInt(parentId)) {
        const children = buildHierarchy(items, item.id);
        if (children.length > 0) {
          item.children = children;
        }
        nestedArray.push(item);
      }
    }
    return nestedArray;
  }

  function viewGroup(id) {
    if (!myGroup?.length) {
      Toast({
        description: "Group doesn't exist!",
      });
      return;
    }
    setGroupModal(true);
  }

  function loadGroup() {
    BackendAxios.get(`/api/my-group/secondary`)
      .then((res) => {
        setMyGroup(res.data);
        const hierarchyArray = buildHierarchy(
          res.data,
          localStorage.getItem("userId")
        );
        setGroupMembers([
          {
            name: localStorage.getItem("userName"),
            children: hierarchyArray,
            id: localStorage.getItem("userId"),
            donation: 0,
          },
        ]);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  return (
    <>
      <Box>
        <HStack w={"full"} justifyContent={"space-between"}>
          <Text fontSize={"xl"}>My Juniors (Secondary ID)</Text>
          <Select width={28} onChange={(e) => setSelectedLevel(e.target.value)}>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
            <option value="5">Level 5</option>
            <option value="6">Level 6</option>
            <option value="7">Level 7</option>
            <option value="8">Level 8</option>
            <option value="9">Level 9</option>
            <option value="10">Level 10</option>
          </Select>
        </HStack>
        <br />
        <NestedChildren
          data={groupMembers[0]?.children || []}
          level={selectedLevel}
          donors={donors}
          completeList={donors}
          groupType={"secondary"}
        />
        {myGroup?.filter((user) => user?.secondary_parent_id == parseInt(myId))
          ?.length ? (
          <HStack justifyContent={"flex-end"} py={4}>
            <Button
              size={"sm"}
              rounded={"full"}
              colorScheme="yellow"
              onClick={() => viewGroup()}
            >
              View Group Tree
            </Button>
          </HStack>
        ) : null}
      </Box>

      <Modal
        isOpen={groupModal}
        onClose={() => setGroupModal(false)}
        size={["full", "4xl"]}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>You Group Members</ModalHeader>
          <ModalBody>
            <Box w={"full"} h={"80vh"} pos={"relative"}>
              <Tree
                data={groupMembers}
                orientation="vertical"
                translate={{ x: 300, y: 200 }}
                separation={{ siblings: 3, nonSiblings: 3 }}
                onNodeMouseOver={(data) => {
                  setShowTooltip({
                    status: true,
                    id: `VCF${data?.data?.id}`,
                    donation: 0,
                  });
                }}
                onNodeMouseOut={() => setShowTooltip({ status: false })}
              />
            </Box>
            <Box
              display={showTooltip.status ? "flex" : "none"}
              flexDirection={"column"}
              pos={"absolute"}
              top={coords.y - 100}
              left={coords.x - 400}
              p={3}
              rounded={4}
              boxShadow={"sm"}
              bgColor={"#FFF"}
            >
              <Text fontSize={"sm"}>ID: {showTooltip.id}</Text>
              <Text fontSize={"sm"}>Collection: {showTooltip.donation}</Text>
            </Box>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const Page = () => {
  const Toast = useToast({ position: "top-right" });
  const { payWithRazorpay } = useRazorpay();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [joinGroupId, setJoinGroupId] = useState("");
  const [invitationModal, setInvitationModal] = useState(false);
  const [onHold, setOnHold] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
  });

  const { value, setValue, onCopy, hasCopied } = useClipboard(
    `${process.env.NEXT_PUBLIC_FRONTEND_URL}?refid=`
  );

  const [canJoinGroup, setCanJoinGroup] = useState(true);

  const [primaryParentUsers, setPrimaryParentUsers] = useState([]);
  const [secondaryParentUsers, setSecondaryParentUsers] = useState([]);

  const [primaryJoined, setPrimaryJoined] = useState(false);
  const [secondaryJoined, setSecondaryJoined] = useState(false);

  const [primaryIdRequested, setPrimaryIdRequested] = useState(false);
  const [secondaryIdRequested, setSecondaryIdRequested] = useState(false);

  const [beneficiaries, setBeneficiaries] = useState([]);

  const [videoStatus, setVideoStatus] = useState(false);
  const [videoData, setVideoData] = useState({
    title: "Watch this video to proceed.",
    id: "",
    provider: "",
    onVideoClose: () => {
      return null;
    },
  });

  const [paymentMethod, setPaymentMethod] = useState("gateway");
  const [giftCard, setGiftCard] = useState("");

  useEffect(() => {
    const idHold = parseInt(localStorage.getItem("onHold")) === 1;
    const primSenId = localStorage.getItem("primaryParentId");
    setOnHold(idHold);
    if (idHold) {
      setJoinGroupId(primSenId);
      getUserInfo(primSenId);
      setPrimaryIdRequested(true);
      onOpen();
    }
    fetchPrimaryParents();
    fetchSecondaryParents();
    fetchMyDonations();
    // fetchMyCollections();
  }, []);

  useEffect(() => {
    if (primaryIdRequested) setSecondaryIdRequested(false);
    if (secondaryIdRequested) setPrimaryIdRequested(false);
  }, [secondaryIdRequested, primaryIdRequested]);

  useEffect(() => {
    setPrimaryJoined(localStorage.getItem("primaryParentId"));
    setSecondaryJoined(localStorage.getItem("secondaryParentId"));
    setCanJoinGroup(localStorage.getItem("canJoinGroup"));
    console.log(localStorage.getItem("canJoinGroup"));
    setValue(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}?ref_id=${localStorage.getItem(
        "userId"
      )}`
    );
  }, []);

  function getUserInfo(id) {
    BackendAxios.get(`/api/users/${id || joinGroupId}`)
      .then((res) => {
        if (res.data?.length) {
          setUserInfo(res.data[0]);
        } else {
          Toast({
            description: "Invalid senior ID",
          });
        }
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  async function handlePayment(params) {
    if (params?.groupType == "primary") {
      setVideoStatus(false);
      await payWithRazorpay({
        orderType: "primary_group",
        id: joinGroupId,
        amount: 250,
        description: "Join Primary Group",
        user: {
          phone: "",
        },
        onSuccess: (trnxnId) => joinPrimaryGroup({ transactionId: trnxnId }),
        onFail: () => {
          Toast({
            status: "error",
            title: "Payment Failed",
            description: "There was an error loading Razorpay checkout",
          });
        },
      });
    } else if (params?.groupType == "secondary") {
      setVideoStatus(false);
      await payWithRazorpay({
        orderType: "secondary_group",
        amount: 500,
        description: "Join Secondary Group",
        user: {
          phone: "",
        },
        onSuccess: (trnxnId) => joinSecondaryGroup({ transactionId: trnxnId }),
        onFail: () => {
          Toast({
            status: "error",
            title: "Payment Failed",
            description: "There was an error loading Razorpay checkout",
          });
        },
      });
    } else {
      setVideoStatus(false);
      Toast({
        status: "warning",
        title: "Intent not found",
        description: "You must state which group you want to join",
      });
    }
  }

  function joinSecondaryGroup(params) {
    if (paymentMethod == "giftCard" && !giftCard) {
      Toast({
        description: "Please enter Gift Card Code",
      });
      setVideoStatus(false);
      return;
    }
    BackendAxios.post(
      paymentMethod == "gateway"
        ? `/api/join-group/${joinGroupId}`
        : `/api/gift/redeem/secondary`,
      {
        code: giftCard,
        amount: 250,
        purpose: "secondary",
        transactionId: params?.transactionId,
      }
    )
      .then((res) => {
        Toast({
          status: "success",
          description: "Group Joined Successfully!",
        });
        setTimeout(() => {
          window.location.reload(true);
        }, 400);
      })
      .catch((err) => {
        setVideoStatus(false);
        onClose();
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function joinPrimaryGroup(params) {
    if (paymentMethod == "giftCard" && !giftCard) {
      Toast({
        description: "Please enter Gift Card Code",
      });
      setVideoStatus(false);
      return;
    }
    paymentMethod == "gateway"
      ? BackendAxios.get(
          `/api/join-group/${joinGroupId}?transactionId=${params?.transactionId}`
        )
      : BackendAxios.post(
          `/api/gift/redeem/primary/${joinGroupId}?code=${giftCard}&amount=250&purpose=primary`
        )
          .then((res) => {
            Toast({
              status: "success",
              description: "Group Joined Successfully!",
            });
            setTimeout(() => {
              window.location.reload(true);
            }, 400);
          })
          .catch((err) => {
            setVideoStatus(false);
            onClose();
            Toast({
              status: "error",
              description:
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message,
            });
          });
  }

  function joinGroup() {
    if (!joinGroupId) {
      Toast({
        description: "Senior ID is required",
      });
      return;
    }
    setVideoStatus(true);
    setVideoData({
      onVideoClose: () => {
        if (joinGroupId == "secondary") {
          if (paymentMethod == "gateway") {
            handlePayment({ groupType: "secondary" });
          } else {
            joinSecondaryGroup();
          }
        } else {
          if (paymentMethod == "gateway") {
            handlePayment({ groupType: "primary" });
          } else {
            joinPrimaryGroup();
          }
        }
      },
    });
  }

  function fetchPrimaryParents() {
    BackendAxios.get(`/api/my-admin`)
      .then((res) => {
        setPrimaryParentUsers(res.data);
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          Cookies.remove("jwt");
          localStorage.clear();
          window.location.assign("/");
          return;
        }
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function fetchSecondaryParents() {
    BackendAxios.get(`/api/my-admin/secondary`)
      .then((res) => {
        setSecondaryParentUsers(res.data);
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          Cookies.remove("jwt");
          localStorage.clear();
          window.location.assign("/");
          return;
        }
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function fetchMyDonations() {
    BackendAxios.get(`/api/my-donations`)
      .then((res) => {
        setBeneficiaries(res.data);
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          Cookies.remove("jwt");
          localStorage.clear();
          window.location.assign("/");
          return;
        }
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  return (
    <>
      <HStack justifyContent={"space-between"}>
        <Text className="serif" fontSize={"2xl"}>
          Group Funding
        </Text>
        <HStack>
          {canJoinGroup == "1" ? (
            <Button
              size={["xs", "md"]}
              colorScheme="yellow"
              rounded={"full"}
              onClick={onOpen}
            >
              Join Group
            </Button>
          ) : null}
        </HStack>
      </HStack>
      {/* <Progress /> */}
      <br />
      <br />
      <Box>
        <Stack
          direction={["column", "row"]}
          justifyContent={"space-around"}
          gap={8}
        >
          <Box>
            <Text fontSize={"xl"}>My Seniors (Primary ID)</Text>
            <br />
            <MyParents
              parents={primaryParentUsers?.slice(0, 10)}
              myParentId={primaryJoined}
              groupType={"primary"}
            />
          </Box>
          <Box>
            <Text fontSize={"xl"}>My Seniors (Secondary ID)</Text>
            <br />
            <MyParents
              parents={secondaryParentUsers?.slice(0, 10)}
              myParentId={secondaryJoined}
              groupType={"secondary"}
            />
          </Box>
        </Stack>
      </Box>
      <br />
      <br />
      <br />
      <Box>
        <Stack
          direction={["column", "row"]}
          justifyContent={"space-around"}
          gap={8}
        >
          <Box>
            <MyChildren
              donors={beneficiaries
                ?.filter((item) => item?.group == "primary")
                .map((item) => item?.donatable_id)}
            />
          </Box>
          <Box>
            <MySecondaryChildren
              donors={beneficiaries
                ?.filter((item) => item?.group == "secondary")
                .map((item) => item?.donatable_id)}
            />
          </Box>
        </Stack>
      </Box>

      <Button
        position={"fixed"}
        bottom={4}
        size={["xs", "md"]}
        right={4}
        rounded={"full"}
        colorScheme="twitter"
        onClick={() => setInvitationModal(true)}
      >
        Invite Friends
      </Button>

      {/* Join Group Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Join Group</ModalHeader>
          <ModalBody alignItems={"center"} justifyContent={"center"}>
            {onHold ? (
              <Text>
                Your ID is on hold. Please pay joining fees to continue sending
                and receiving donations.
              </Text>
            ) : null}
            <HStack py={4}>
              <Button
                onClick={() => setPrimaryIdRequested(true)}
                colorScheme="yellow"
                isDisabled={Boolean(primaryJoined)}
              >
                Activate Primary ID
              </Button>
              {onHold ? null : (
                <Button
                  onClick={() => {
                    setJoinGroupId("secondary");
                    setSecondaryIdRequested(true);
                  }}
                  colorScheme="twitter"
                  isDisabled={
                    Boolean(secondaryJoined) || Boolean(!primaryJoined)
                  }
                >
                  Activate Secondary ID
                </Button>
              )}
            </HStack>
            <br />
            {primaryIdRequested ? (
              <Box
                py={4}
                w={"full"}
                display={"flex"}
                flexDir={"column"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <InputGroup>
                  <Input
                    onChange={(e) => setJoinGroupId(e.target.value)}
                    variant={"flushed"}
                    placeholder="Enter Senior ID To Join"
                    value={joinGroupId}
                    isDisabled={onHold}
                  />
                  <InputRightAddon
                    bgColor={"#FFF"}
                    borderRight={"0"}
                    borderTop={"0"}
                    onClick={() => getUserInfo()}
                    children={
                      <Text
                        fontSize={"xs"}
                        color={"twitter.500"}
                        fontWeight={"semibold"}
                        cursor={"pointer"}
                      >
                        Verify
                      </Text>
                    }
                  />
                </InputGroup>
                <Text mt={2} fontSize={"xs"}>
                  {userInfo?.name} - ({userInfo?.phone || "Phone No. not added"}
                  )
                </Text>
              </Box>
            ) : null}
            {secondaryIdRequested ? (
              <HStack>
                <Text w={"70%"} fontSize={"xs"}>
                  Our system will automatically join you with a random senior ID
                </Text>
              </HStack>
            ) : null}
            {paymentMethod == "giftCard" ? (
              <Box pt={16}>
                <Text textAlign={"center"}>Enter Gift PIN</Text>
                <HStack w={"full"} justifyContent={"center"} gap={4}>
                  <PinInput otp onComplete={(value) => setGiftCard(value)}>
                    <PinInputField bgColor={"gray.100"} />
                    <PinInputField bgColor={"gray.100"} />
                    <PinInputField bgColor={"gray.100"} />
                    <PinInputField bgColor={"gray.100"} />
                    <PinInputField bgColor={"gray.100"} />
                    <PinInputField bgColor={"gray.100"} />
                  </PinInput>
                </HStack>
              </Box>
            ) : null}
          </ModalBody>
          <ModalFooter gap={8} justifyContent={"flex-end"}>
            {paymentMethod == "gateway" &&
            (!primaryJoined || !secondaryJoined) ? (
              <Text
                color={"blue.600"}
                onClick={() => setPaymentMethod("giftCard")}
                cursor={"pointer"}
                fontWeight={"semibold"}
              >
                Pay with Gift PIN
              </Text>
            ) : paymentMethod == "giftCard" &&
              (!primaryJoined || !secondaryJoined) ? (
              <Text
                color={"blue.600"}
                onClick={() => {
                  setPaymentMethod("gateway");
                }}
                cursor={"pointer"}
                fontWeight={"semibold"}
              >
                Pay with Razorpay
              </Text>
            ) : null}
            {primaryIdRequested && (
              <Button
                w={["auto", "auto"]}
                colorScheme="yellow"
                onClick={joinGroup}
              >
                Join with ₹250
              </Button>
            )}
            {secondaryIdRequested && (
              <Button size={"sm"} colorScheme="twitter" onClick={joinGroup}>
                Join with ₹500
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Invitation Modal */}
      <Modal isOpen={invitationModal} onClose={() => setInvitationModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite To Your Group</ModalHeader>
          <ModalBody alignItems={"center"} justifyContent={"center"}>
            <Text textAlign={"center"}>
              Share this link and invite your friends.
              <br />
              <b>
                They will be automatically added to your group once they signup
                through your code
              </b>
            </Text>
            <br />
            <HStack justifyContent={"center"}>
              <Box
                p={2}
                border={"1px"}
                borderStyle={"dashed"}
                borderColor={"blackAlpha.200"}
              >
                {value}
              </Box>
              <Button
                size={"sm"}
                onClick={onCopy}
                colorScheme={hasCopied ? "whatsapp" : "gray"}
              >
                {hasCopied ? "Copied!" : "Copy"}
              </Button>
            </HStack>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      {videoStatus ? (
        <VideoPlayer
          status={videoStatus}
          title={videoData.title}
          onVideoClose={videoData.onVideoClose}
        />
      ) : null}

      <VerticalSpacer />
    </>
  );
};

export default Page;
